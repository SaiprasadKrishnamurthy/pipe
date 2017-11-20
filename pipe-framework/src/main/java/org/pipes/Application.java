package org.pipes;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.pool.KryoPool;
import io.thekraken.grok.api.Grok;
import org.elasticsearch.action.ActionFuture;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.xpack.client.PreBuiltXPackTransportClient;
import org.pipes.amqp.MessageListener;
import org.pipes.amqp.MessageSender;
import org.pipes.api.PipeConfig;
import org.pipes.service.PipelineCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableCaching
@ComponentScan(basePackages = {"org.pipes"})
@ImportResource("classpath*:*pipeline-config.xml")
public class Application {

    private static final Logger logger = LoggerFactory.getLogger(Application.class);

    public final static String PIPELINE_EXCHANGE = "PIPELINE_EXCHANGE";

    @Value("${elasticsearch.clustername}")
    private String esClusterName;

    @Value("${elasticsearch.host}")
    private String esHost;

    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${elasticsearch.port}")
    private int esPort;

    @Value("${xpack.security.user}")
    private String xpackEsUser;

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Autowired
    private ConnectionFactory connectionFactory;

    @Autowired
    private PipelineCache pipelineCache;

    @Value("${server.port}")
    private int port;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Bean
    RabbitAdmin rabbitAdmin() {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public Client es() throws Exception {
        Settings settings = Settings.builder()
                .put("client.transport.nodes_sampler_interval", "5s")
                .put("client.transport.sniff", false)
                .put("transport.tcp.compress", true)
                .put("cluster.name", esClusterName)
                .put("xpack.security.user", xpackEsUser)
                .build();

        TransportClient client = new PreBuiltXPackTransportClient(settings);
        try {
            for (InetAddress address : InetAddress.getAllByName(esHost)) {
                client.addTransportAddress(new InetSocketTransportAddress(address, esPort));
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        boolean breakOut = false;
        while (!breakOut) {
            try {
                logger.info("Getting cluster health... ");
                ActionFuture<ClusterHealthResponse> healthFuture = client.admin().cluster().health(Requests.clusterHealthRequest());
                ClusterHealthResponse healthResponse = healthFuture.get(5, TimeUnit.SECONDS);
                logger.info("  \n\n\n ************************************");
                logger.info("Got cluster health response: [{}]", healthResponse.getStatus());
                logger.info(" ************************************ \n\n\n");
                breakOut = true;

            } catch (Throwable t) {
                logger.error("Unable to get cluster health response: [{}]", t.getMessage());
                throw t;
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException ie) {
                ie.printStackTrace();
            }
        }
        return client;
    }

    @Bean
    CacheManager cacheManager() {
        SimpleCacheManager simpleCacheManager = new SimpleCacheManager();
        List<Cache> caches = new ArrayList<Cache>();
        caches.add(new ConcurrentMapCache("configs"));
        caches.add(new ConcurrentMapCache("config"));
        caches.add(new ConcurrentMapCache("allns"));
        caches.add(new ConcurrentMapCache("byns"));
        simpleCacheManager.setCaches(caches);
        return simpleCacheManager;
    }

    @Bean
    Grok grok() throws Exception {
        Grok g = new Grok();
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("java")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("firewalls")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("haproxy")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("linux-syslog")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("nagios")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("patterns")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("postfix")));
        g.addPatternFromReader(new InputStreamReader(Application.class.getClassLoader().getResourceAsStream("ruby")));
        return g;
    }

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(redisHost, redisPort);
        JedisConnectionFactory jedisConFactory = new JedisConnectionFactory(redisStandaloneConfiguration);
        return jedisConFactory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(jedisConnectionFactory());
        return redisTemplate;
    }


    @Bean
    KryoPool kryoPool() {
        return new KryoPool.Builder(Kryo::new).softReferences().build();
    }

    @Bean
    public CommandLineRunner loadData(final RabbitTemplate rabbitTemplate, final MessageSender messageSender) {
        return (args) -> {
            System.out.println(" *********************** LOADED INIT DATA *********************** ");
            System.out.println(" *********************** APP IS NOW RUNNING *********************** " + port);
            System.out.println("Sending message...");

            // cache warm up
            System.out.println(pipelineCache.getPipes());
            System.out.println(pipelineCache.getAllNamespaces());
            pipelineCache.getPipes().forEach(pipeConfig -> pipelineCache.getPipeConfig(pipeConfig.getPipelineId()));
            pipelineCache.getAllNamespaces().forEach(pipelineCache::getByNamespace);
        };
    }

    @Bean
    SimpleMessageListenerContainer container(final ConnectionFactory connectionFactory,
                                             final MessageListener receiver,
                                             final RabbitAdmin rabbitAdmin,
                                             final PipelineCache pipelineCache) {
        List<String> pipelineIds = pipelineCache.getPipes().stream().map(PipeConfig::getPipelineId).collect(Collectors.toList());
        rabbitAdmin.declareExchange(new TopicExchange(PIPELINE_EXCHANGE));
        pipelineIds.forEach(p -> rabbitAdmin.declareQueue(new Queue(p)));
        pipelineIds.forEach(p -> rabbitAdmin.declareBinding(BindingBuilder.bind(new Queue(p, false)).to(new TopicExchange(PIPELINE_EXCHANGE)).with(p)));
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(pipelineIds.toArray(new String[pipelineIds.size()]));
        container.setMessageListener(new MessageListenerAdapter(receiver, "receiveMessage"));
        return container;
    }


    public static void main(String[] args) throws InterruptedException {
        SpringApplication.run(Application.class, args);
    }

}
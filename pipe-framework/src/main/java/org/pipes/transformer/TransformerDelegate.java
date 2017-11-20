package org.pipes.transformer;

import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.pool.KryoPool;
import org.pipes.api.Message;
import org.pipes.api.MessageTransformer;
import org.pipes.api.PipeConfig;
import org.pipes.repository.ESRepository;
import org.pipes.repository.StatsRepository;
import org.pipes.service.PipelineCache;
import org.pipes.stats.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Created by saipkri on 17/11/17.
 */
@Component
public class TransformerDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransformerDelegate.class);
    private final ApplicationContext applicationContext;
    private final PipelineCache pipelineCache;
    private final KryoPool kryoPool;
    private final ESRepository esRepository;
    private final StatsRepository statsRepository;

    @Inject
    public TransformerDelegate(final ApplicationContext applicationContext, final PipelineCache pipelineCache, final KryoPool kryoPool, final ESRepository esRepository, final StatsRepository statsRepository) {
        this.applicationContext = applicationContext;
        this.pipelineCache = pipelineCache;
        this.kryoPool = kryoPool;
        this.esRepository = esRepository;
        this.statsRepository = statsRepository;
    }

    public void transform(final byte[] payload) {
        CompletableFuture
                .supplyAsync(() -> deserializeMessage(payload))
                .thenApply(message -> {
                    String springBeanName = transformerSpringBeanName(message, pipelineCache.getPipeConfig(message.getPipelineId().trim()).get());
                    invoke(springBeanName, message);
                    return null;
                }).exceptionally(t -> {
            LOGGER.error("Error ", t);
            t.printStackTrace();
            return null;
        });
    }

    private void invoke(final String springBeanName, final Message message) {
        MessageTransformer messageTransformer = applicationContext.getBean(springBeanName, MessageTransformer.class);
        List<Object> transformed = message.getPayload()
                .stream()
                .map(payload -> messageTransformer.transform(payload))
                .collect(Collectors.toList());

        PipeConfig config = pipelineCache.getPipeConfig(message.getPipelineId()).get();
        if (!message.isRealtime()) {
            if (!message.isLastBatch()) {
                esRepository.saveBatch(transformed, config);
                CompletableFuture
                        .runAsync(() -> statsRepository.saveLog(new Log(config.getPipelineId(), message.getTxnId(), System.currentTimeMillis(), transformed.size())))
                        .exceptionally(t -> {
                            LOGGER.error("Error ", t);
                            t.printStackTrace();
                            return null;
                        });
            }
        }
    }

    private Message deserializeMessage(final byte[] payload) {
        return kryoPool.run(kryo -> {
            Input in = new Input(new ByteArrayInputStream(payload));
            in.close();
            return kryo.readObject(in, Message.class);
        });
    }

    private String transformerSpringBeanName(final Message message, final PipeConfig pipeConfig) {
        if (message.isRealtime()) {
            return pipeConfig.getRealtime().getTransformer();
        } else {
            return pipeConfig.getBatch().getTransformer();
        }
    }
}

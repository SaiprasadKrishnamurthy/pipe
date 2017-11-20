package org.pipes.amqp;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Output;
import com.esotericsoftware.kryo.pool.KryoPool;
import org.pipes.Application;
import org.pipes.api.Message;
import org.pipes.service.PipelineCache;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Created by saipkri on 17/11/17.
 */
@Component
public class MessageSender {
    private final KryoPool kryoPool;
    private final RabbitTemplate rabbitTemplate;
    private final PipelineCache pipelineCache;

    @Inject
    public MessageSender(final KryoPool kryoPool, final RabbitTemplate rabbitTemplate, final PipelineCache pipelineCache) {
        this.kryoPool = kryoPool;
        this.rabbitTemplate = rabbitTemplate;
        this.pipelineCache = pipelineCache;
    }

    public void send(final Message payload, final String pipelineId) {
        kryoPool.run(kryo -> {
            try {
                ByteArrayOutputStream b = new ByteArrayOutputStream();
                Output out = new Output(b);
                kryo.writeObject(out, payload);
                out.close();
                rabbitTemplate.convertAndSend(Application.PIPELINE_EXCHANGE, pipelineId, MessageBuilder.withBody(b.toByteArray()).build());
                return null;
            } catch (Exception ex) {
                ex.printStackTrace();
                throw new RuntimeException(ex);
            }

        });
    }

    public static void main(String[] args) {
        KryoPool pool = new KryoPool.Builder(Kryo::new).softReferences().build();
        final List<Object> docs = IntStream.range(0, 10).mapToObj(s -> UUID.randomUUID().toString()).collect(Collectors.toList());
        Kryo k = new Kryo();
        pool.run(kryo -> {
            Output out = new Output(System.out);
            kryo.writeObjectOrNull(out, docs, ArrayList.class);
            out.close();
            return null;
        });
    }
}

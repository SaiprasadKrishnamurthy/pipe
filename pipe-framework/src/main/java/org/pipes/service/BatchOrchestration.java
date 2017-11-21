package org.pipes.service;

import org.pipes.amqp.MessageSender;
import org.pipes.api.EsBatchDataInput;
import org.pipes.api.Message;
import org.pipes.api.Orchestration;
import org.pipes.api.PipeConfig;
import org.pipes.repository.StatsRepository;
import org.pipes.stats.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

/**
 * Created by saipkri on 17/11/17.
 */
@Service
@Qualifier("batchOrchestration")
public class BatchOrchestration implements Orchestration {

    private static final Logger LOGGER = LoggerFactory.getLogger(BatchOrchestration.class);

    private final PipelineCache pipelineCache;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final MessageSender messageSender;
    private final RabbitAdmin rabbitAdmin;
    private final StatsRepository statsRepository;
    private final ApplicationContext applicationContext;

    @Inject
    public BatchOrchestration(final PipelineCache pipelineCache, final ElasticsearchTemplate elasticsearchTemplate, final MessageSender messageSender, final RabbitAdmin rabbitAdmin, final StatsRepository statsRepository, final ApplicationContext applicationContext) {
        this.pipelineCache = pipelineCache;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.messageSender = messageSender;
        this.rabbitAdmin = rabbitAdmin;
        this.statsRepository = statsRepository;
        this.applicationContext = applicationContext;
    }

    @Override
    public void process(final String pipelineId, final String txnId, final Optional<Object> payload) {
        PipeConfig pipeConfig = pipelineCache.getPipeConfig(pipelineId.trim()).get();
        statsRepository.saveJob(new Job(txnId, pipelineId, System.currentTimeMillis(), 0L));
        if (pipeConfig.getBatch().getElasticsearch() != null) {
            Consumer<List<Object>> processBatch = results -> {
                Message msg = new Message();
                msg.setTxnId(txnId);
                msg.setPayload(results);
                msg.setPipelineId(pipelineId);
                LOGGER.info("Sending batch data data from ES pipeline {} txn {} size {}", pipelineId, txnId, results.size());
                messageSender.send(msg, pipelineId);
            };
            Consumer<Message> endBatch = msg -> {
                LOGGER.info("Finished reading all the data from ES pipeline {} txn {} size {}", pipelineId, txnId);
                statsRepository.deleteRunning(pipelineId);
                statsRepository.updateJob(msg.getTxnId());
            };
            EsBatchDataInput esBatchDataInput = new EsBatchDataInput(processBatch, endBatch, elasticsearchTemplate, pipelineId, pipelineCache, txnId, applicationContext);
            esBatchDataInput.killSignal(() -> statsRepository.isKilled(txnId.trim()));
        }
    }

    @Override
    public void kill(final String pipelineId, final String txnId) {
        rabbitAdmin.purgeQueue(pipelineId, true);
    }
}

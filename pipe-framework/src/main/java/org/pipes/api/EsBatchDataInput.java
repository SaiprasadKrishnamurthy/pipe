package org.pipes.api;

import org.pipes.service.PipelineCache;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ScrolledPage;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.function.Supplier;

import static org.elasticsearch.index.query.QueryBuilders.wrapperQuery;

/**
 * Created by saipkri on 16/11/17.
 */
public class EsBatchDataInput implements BatchDataInput<Object> {

    private final Consumer<List<Object>> resultCallback;
    private final Consumer<Message> endCallback;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final String txnId;
    private final String pipelineId;
    private final PipelineCache pipelineCache;
    private Supplier<Boolean> killSignalSupplier;
    private final ApplicationContext applicationContext;
    private static final int SCROLL_ALIVE_TIME_IN_MINUTES = 5 * 1000 * 60;


    public EsBatchDataInput(final Consumer<List<Object>> resultCallback, final Consumer<Message> endCallback,
                            final ElasticsearchTemplate elasticsearchTemplate,
                            final String pipelineId, final PipelineCache pipelineCache,
                            final String txnId,
                            final ApplicationContext applicationContext) {
        this.resultCallback = resultCallback;
        this.endCallback = endCallback;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.pipelineId = pipelineId;
        this.pipelineCache = pipelineCache;
        this.txnId = txnId;
        this.applicationContext = applicationContext;
        emit();
    }

    @Override
    public void emit() {
        PipeConfig pipeConfig = pipelineCache.getPipeConfig(pipelineId.trim()).get();
        try {
            String rawQuery;
            if (pipeConfig.getBatch().getElasticsearch().getQueryProvider() == null) {
                rawQuery = pipeConfig.getBatch().getElasticsearch().getQuery();
            } else {
                rawQuery = applicationContext.getBean(pipeConfig.getBatch().getElasticsearch().getQueryProvider(), QueryProvider.class).rawQuery();
            }
            SearchQuery searchQuery = new NativeSearchQueryBuilder()
                    .withQuery(wrapperQuery(rawQuery))
                    .withIndices(pipeConfig.getBatch().getElasticsearch().getFromIndex())
                    .withTypes(pipeConfig.getBatch().getElasticsearch().getFromType())
                    .withPageable(PageRequest.of(0, pipeConfig.getBatch().getElasticsearch().getBatchSize()))
                    .build();
            ScrolledPage<?> scrolledPage = (ScrolledPage<Object>) elasticsearchTemplate.startScroll(SCROLL_ALIVE_TIME_IN_MINUTES, searchQuery, Class.forName(pipeConfig.getBatch().getPojo()));
            while (scrolledPage.hasContent() && killSignalSupplier != null && !killSignalSupplier.get()) {
                List<Object> content = new ArrayList<>(scrolledPage.getContent());
                CompletableFuture.supplyAsync(() -> {
                    resultCallback.accept(content);
                    return null;
                }).exceptionally(t -> {
                    t.printStackTrace();
                    return null;
                });
                scrolledPage = (ScrolledPage<Object>) elasticsearchTemplate.continueScroll(scrolledPage.getScrollId(), SCROLL_ALIVE_TIME_IN_MINUTES, Class.forName(pipeConfig.getBatch().getPojo()));
            }
            endCallback.accept(new Message(txnId, pipelineId, null, false, true));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public Consumer<List<Object>> resultCallback() {
        return this.resultCallback;
    }

    @Override
    public Consumer<Message> endBatch() {
        return this.endCallback;
    }

    @Override
    public void elasticsearchTemplate(ElasticsearchTemplate elasticsearchTemplate) {

    }

    @Override
    public void jdbcTemplate(final JdbcTemplate jdbcTemplate) {
        // Who cares..
    }

    @Override
    public void killSignal(final Supplier<Boolean> killSignalSupplier) {
        this.killSignalSupplier = killSignalSupplier;
    }

    @Override
    public String pipelineId() {
        return this.pipelineId;
    }

}

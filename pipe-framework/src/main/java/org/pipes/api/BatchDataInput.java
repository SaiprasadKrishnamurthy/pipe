package org.pipes.api;

import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.function.Consumer;

/**
 * Created by saipkri on 16/11/17.
 */
public interface BatchDataInput<I> {
    void emit();

    Consumer<List<I>> resultCallback();

    Consumer<Message> endBatch();

    void elasticsearchTemplate(ElasticsearchTemplate elasticsearchTemplate);

    void jdbcTemplate(JdbcTemplate jdbcTemplate);

    String pipelineId();
}

package org.pipes.repository;

import com.google.gson.Gson;
import org.pipes.api.PipeConfig;
import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by saipkri on 17/11/17.
 */
@Repository
public class ESRepository {

    private final ElasticsearchTemplate elasticsearchTemplate;

    @Inject
    public ESRepository(final ElasticsearchTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    public void saveBatch(final List<Object> docs, final PipeConfig config) {
        List<IndexQuery> queries = new ArrayList<>();
        Gson gson = new Gson();
        docs.forEach(doc -> {
            try {
                IndexQuery indexQuery = new IndexQuery();
                indexQuery.setId(PropertyUtils.getProperty(doc, config.getBatch().getElasticsearch().getIdField()).toString());
                indexQuery.setSource(gson.toJson(doc));
                indexQuery.setIndexName(config.getBatch().getElasticsearch().getToIndex());
                indexQuery.setType(config.getBatch().getElasticsearch().getToType());
                queries.add(indexQuery);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            elasticsearchTemplate.bulkIndex(queries);
        });
    }
}

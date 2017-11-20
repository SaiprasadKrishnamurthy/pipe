package com.sai.samples.bank.transformer;

import com.sai.samples.bank.model.Account;
import org.pipes.api.MessageTransformer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Created by saipkri on 17/11/17.
 */
@Service
@Qualifier("passThroughTransformer")
public class PassThroughTransformer implements MessageTransformer<Account, Account> {

    private final ElasticsearchTemplate elasticsearchTemplate;

    @Inject
    public PassThroughTransformer(final ElasticsearchTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Account transform(final Account input) {
        return input;
    }
}

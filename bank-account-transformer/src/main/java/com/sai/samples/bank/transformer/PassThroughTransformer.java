package com.sai.samples.bank.transformer;

import com.sai.samples.bank.model.Account;
import org.pipes.api.MessageTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;

/**
 * Created by saipkri on 17/11/17.
 */
@Service
@Qualifier("passThroughTransformer")
public class PassThroughTransformer implements MessageTransformer<Account, Account> {

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;

    public PassThroughTransformer() {
        System.out.println(elasticsearchTemplate + "********************************\n\n\n\n");
    }

    @Override
    public Account transform(final Account input) {
        return input;
    }
}

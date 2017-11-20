package org.pipes.transformer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.pipes.api.MessageTransformer;
import io.thekraken.grok.api.Grok;
import io.thekraken.grok.api.Match;

import javax.inject.Inject;

/**
 * Created by saipkri on 17/11/17.
 */
public abstract class GrokTransformer<T> implements MessageTransformer<String, T> {
    // TODO check threadsafety
    private final Grok grok;
    private static final ObjectMapper mapper = new ObjectMapper();

    protected abstract String grokPattern();

    protected abstract Class<T> targetClass();

    @Inject
    public GrokTransformer(final Grok grok) {
        this.grok = grok;
    }

    @Override
    public T transform(final String input) {
        try {
            // TODO Check if this can be cached.
            grok.compile(grokPattern());
            Match gm = grok.match(input);
            gm.captures();
            return mapper.readValue(gm.toJson(), targetClass());
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}

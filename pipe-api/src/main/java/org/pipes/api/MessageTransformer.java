package org.pipes.api;

/**
 * Created by saipkri on 16/11/17.
 */
public interface MessageTransformer<I,O> {
    O transform(I input);
}

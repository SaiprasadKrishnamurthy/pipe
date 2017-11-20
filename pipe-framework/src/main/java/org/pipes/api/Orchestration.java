package org.pipes.api;

import java.util.Optional;

/**
 * Created by saipkri on 17/11/17.
 */
public interface Orchestration {
    void process(String pipelineId, String txnId, Optional<Object> payload);
    void kill(String pipelineId, String txnId);
}

package org.pipes.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Created by saipkri on 17/11/17.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message implements Serializable {
    private String txnId;
    private String pipelineId;
    private List<Object> payload;
    private boolean realtime;
    private boolean lastBatch;
}

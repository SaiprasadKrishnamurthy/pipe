package org.pipes.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.ResourceSupport;

import java.io.Serializable;

/**
 * Created by saipkri on 17/11/17.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Killed extends ResourceSupport implements Serializable {
    private String txnId;
    private String pipelineId;
    private long timestamp;
}

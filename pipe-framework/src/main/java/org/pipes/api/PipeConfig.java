
package org.pipes.api;

import lombok.Data;
import org.springframework.hateoas.ResourceSupport;

@Data
public class PipeConfig extends ResourceSupport {
    private String namespace;
    private String pipelineId;
    private String description;
    private String author;
    private Realtime realtime;
    private Batch batch;
}

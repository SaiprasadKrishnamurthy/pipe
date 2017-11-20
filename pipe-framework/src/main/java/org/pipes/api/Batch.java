
package org.pipes.api;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Batch {
    private Elasticsearch elasticsearch;
    private String transformer;
    private String pojo;
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();
}

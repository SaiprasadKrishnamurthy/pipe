
package org.pipes.api;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Realtime {
    private String transformer;
    private String pojo;
    private String index;
    private String idField;
    private int batchSize;
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();
}

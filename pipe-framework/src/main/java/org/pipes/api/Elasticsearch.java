
package org.pipes.api;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Elasticsearch {
    private String fromIndex;
    private String fromType;
    private String toIndex;
    private String toType;
    private String idField;
    private Integer parallelSlices;
    private Integer batchSize;
    private String docValueField;
    private String query;
    private String queryProvider;
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();
}

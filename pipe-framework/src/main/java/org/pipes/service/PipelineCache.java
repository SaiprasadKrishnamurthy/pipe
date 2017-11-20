package org.pipes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.apache.commons.io.IOUtils;
import org.pipes.api.PipeConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by saipkri on 17/11/17.
 */
@Service
public class PipelineCache {
    private static final Logger LOGGER = LoggerFactory.getLogger(PipelineCache.class);

    @Value("classpath*:*pipeline.yml")
    private Resource[] configs;

    @Cacheable(value = "configs")
    public List<PipeConfig> getPipes() {
        LOGGER.info("Config ymls discovered: " + Arrays.deepToString(configs));
        final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        return Stream.of(configs)
                .map(resource -> {
                    LOGGER.info("PIPE | Descriptor is: " + resource);
                    try {
                        return mapper.readValue(IOUtils.toString(resource.getInputStream(), Charset.defaultCharset()), PipeConfig.class);
                    } catch (IOException ioe) {
                        throw new UncheckedIOException(ioe);
                    }
                }).collect(Collectors.toList());
    }

    @Cacheable(value = "config")
    public Optional<PipeConfig> getPipeConfig(final String pipelineId) {
        return getPipes().stream().filter(pipeConfig -> pipeConfig.getPipelineId().equalsIgnoreCase(pipelineId))
                .findFirst();
    }


    @Cacheable(value = "allns")
    public List<String> getAllNamespaces() {
        return getPipes().stream()
                .map(PipeConfig::getNamespace)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "byns")
    public List<PipeConfig> getByNamespace(final String namespace) {
        return getPipes().stream()
                .filter(pipeConfig -> pipeConfig.getNamespace().equalsIgnoreCase(namespace))
                .collect(Collectors.toList());
    }
}

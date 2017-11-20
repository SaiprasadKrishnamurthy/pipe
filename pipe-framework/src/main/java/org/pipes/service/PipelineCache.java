package org.pipes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.google.common.io.Resources;
import com.google.common.reflect.ClassPath;
import org.pipes.api.PipeConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by saipkri on 17/11/17.
 */
@Service
public class PipelineCache {
    private static final Logger LOGGER = LoggerFactory.getLogger(PipelineCache.class);

    @Cacheable(value = "configs")
    public List<PipeConfig> getPipes() {
        List<PipeConfig> configs = new ArrayList<>();
        try {
            final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
            ClassPath classpath = ClassPath.from(Thread.currentThread().getContextClassLoader());
            classpath.getResources()
                    .stream()
                    .filter(resourceInfo -> resourceInfo.getResourceName().endsWith("pipeline.yml"))
                    .forEach(resource -> {
                        LOGGER.info("PIPE | Descriptor is: " + resource);
                        try {
                            configs.add(mapper.readValue(Resources.asByteSource(Resources.getResource(resource.getResourceName())).openStream(), PipeConfig.class));
                        } catch (IOException ioe) {
                            throw new UncheckedIOException(ioe);
                        }
                    });
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
        return configs;
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

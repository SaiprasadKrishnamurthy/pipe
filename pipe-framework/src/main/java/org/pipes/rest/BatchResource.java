package org.pipes.rest;

import com.google.common.collect.ImmutableMap;
import org.pipes.api.Orchestration;
import org.pipes.api.PipeConfig;
import org.pipes.repository.StatsRepository;
import org.pipes.service.PipelineCache;
import org.pipes.stats.Job;
import org.pipes.stats.Killed;
import org.pipes.stats.Log;
import org.pipes.stats.Running;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.TemplateVariable;
import org.springframework.hateoas.UriTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by saipkri on 17/11/17.
 */
@RestController
@RequestMapping("/v1")
public class BatchResource {

    private final Orchestration orchestration;
    private final PipelineCache pipelineCache;
    private final StatsRepository statsRepository;

    @Inject
    public BatchResource(@Qualifier("batchOrchestration") final Orchestration orchestration, final PipelineCache pipelineCache, final StatsRepository statsRepository) {
        this.orchestration = orchestration;
        this.pipelineCache = pipelineCache;
        this.statsRepository = statsRepository;
    }

    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    @GetMapping("/job/{pipelineId}/start")
    public ResponseEntity<Map<String, String>> startBatch(@PathVariable("pipelineId") final String pipelineId, @RequestParam(value = "force", defaultValue = "false") final boolean force) {
        if (!pipelineCache.getPipeConfig(pipelineId.trim()).isPresent()) {
            return new ResponseEntity<>(ImmutableMap.of("message", "No configuration found for id: " + pipelineId), HttpStatus.NOT_FOUND);
        }
        if (!force) {
            Running existing = statsRepository.findRunning(pipelineId.trim());
            if (existing != null) {
                return new ResponseEntity<>(ImmutableMap.of("pipelineId", pipelineId, "status", "not submitted", "message", "the job is already running since: " + new Date(existing.getTimestamp())), HttpStatus.CONFLICT);
            }
        } else {
            statsRepository.deleteRunning(pipelineId);
        }
        statsRepository.saveStart(new Running(pipelineId.trim(), System.currentTimeMillis()));
        String txnId = UUID.randomUUID().toString();
        orchestration.process(pipelineId.trim(), txnId, Optional.empty());
        return new ResponseEntity<>(ImmutableMap.of("pipelineId", pipelineId, "status", "submitted", "jobId", txnId), HttpStatus.CREATED);
    }

    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    @GetMapping("/job/{pipelineId}/{txnId}/kill")
    public ResponseEntity<Map<String, String>> killBatch(@PathVariable("pipelineId") final String pipelineId,
                                                         @PathVariable("txnId") final String txnId) {
        if (!pipelineCache.getPipeConfig(pipelineId.trim()).isPresent()) {
            return new ResponseEntity<>(ImmutableMap.of("message", "No configuration found for id: " + pipelineId), HttpStatus.NOT_FOUND);
        }
        statsRepository.deleteRunning(pipelineId.trim());
        statsRepository.saveKilled(new Killed(pipelineId, System.currentTimeMillis()));
        orchestration.kill(pipelineId, txnId);
        return new ResponseEntity<>(ImmutableMap.of("pipelineId", pipelineId, "status", "deleted"), HttpStatus.OK);
    }

    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    @GetMapping("/batch/recent-killed")
    public ResponseEntity<Collection<Killed>> recentKilled() {
        return new ResponseEntity<>(statsRepository.findAllKilled().values(), HttpStatus.OK);
    }

    @GetMapping("/job/recent-killed/{pipelineId}")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<Collection<Killed>> recentKilled(@PathVariable(name = "pipelineId") final String pipelineId) {
        return new ResponseEntity<>(statsRepository.findAllKilled().values().stream()
                .filter(killed -> killed.getPipelineId().equals(pipelineId.trim()))
                .collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/job/running/{pipelineId}")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<Collection<Running>> running(@PathVariable(name = "pipelineId") final String pipelineId) {
        return new ResponseEntity<>(statsRepository.findAllRunning().values().stream()
                .filter(j -> j.getPipelineId().equals(pipelineId))
                .collect(Collectors.toList())
                , HttpStatus.OK);
    }

    @GetMapping("/job/{txnId}/docs-loaded-stats")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<Collection<Log>> docsLoaded(@PathVariable("txnId") String pipelineId,
                                                      @RequestParam(value = "topN", defaultValue = "50") long topN) {
        return new ResponseEntity<>(statsRepository.logs(pipelineId.trim(), topN), HttpStatus.OK);
    }

    @GetMapping("/jobs")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<Collection<Job>> jobs() {
        return new ResponseEntity<>(statsRepository.jobs().values(), HttpStatus.OK);
    }

    @GetMapping("/jobs/{pipelineId}")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<Collection<Job>> jobsForPipeline(@PathVariable(name = "pipelineId") final String pipelineId) {
        return new ResponseEntity<>(statsRepository.jobs().values().stream()
                .filter(j -> j.getPipelineId().equals(pipelineId))
                .collect(Collectors.toList()), HttpStatus.OK);
    }

    @GetMapping("/jobs/purge-all")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<?> purgeAll() {
        statsRepository.deleteRunning();
        statsRepository.deleteJobs();
        statsRepository.deleteLog();
        return new ResponseEntity<>(ImmutableMap.of("status", "deleted"), HttpStatus.OK);
    }

    @GetMapping("/pipelines")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<List<PipeConfig>> pipelines() {
        List<PipeConfig> pipes = pipelineCache.getPipes();
        pipes
                .forEach(p ->
                {
                    p.add(new Link("/v1/pipeline/" + p.getPipelineId(), "self"));
                    p.add(new Link("/v1/job/" + p.getPipelineId() + "/start?force=false", "startJob"));
                    p.add(new Link("/v1/job/" + p.getPipelineId() + "/start?force=true", "forceStartJob"));
                    p.add(new Link("/v1/jobs/" + p.getPipelineId(), "jobs"));
                    p.add(new Link("/v1/job/recent-killed/" + p.getPipelineId(), "killedJobs"));
                    p.add(new Link("/v1/job/running/" + p.getPipelineId(), "runningJobs"));
                    p.add(new Link(new UriTemplate("/v1//job/{txnId}/docs-loaded-stats/").with("txnId", TemplateVariable.VariableType.PATH_VARIABLE), "docLoadedStats"));
                });
        return new ResponseEntity<>(pipes, HttpStatus.OK);
    }

    @GetMapping("/pipeline/{pipelineId}")
    @CrossOrigin(methods = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS, RequestMethod.GET})
    public ResponseEntity<PipeConfig> pipeline(@PathVariable(name = "pipelineId") final String pipelineId) {
        return new ResponseEntity<>(pipelineCache.getPipeConfig(pipelineId).get(), HttpStatus.OK);
    }
}

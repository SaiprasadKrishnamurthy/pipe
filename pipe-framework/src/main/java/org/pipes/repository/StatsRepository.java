package org.pipes.repository;

import org.pipes.stats.Job;
import org.pipes.stats.Killed;
import org.pipes.stats.Log;
import org.pipes.stats.Running;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;
import java.util.Map;

/**
 * Created by saipkri on 17/11/17.
 */
@Repository
public class StatsRepository {
    private static final String RUNNING = "RUNNING_JOBS";
    private static final String KILLED = "KILLED_JOBS";
    private static final String LOG = "LOG";
    private final RedisTemplate redisTemplate;
    private final String JOBS = "JOBS";
    private HashOperations hashOps;
    private ListOperations listOps;

    @Inject
    public StatsRepository(final RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    private void init() {
        hashOps = redisTemplate.opsForHash();
        listOps = redisTemplate.opsForList();
    }

    public void saveStart(final Running running) {
        hashOps.put(RUNNING, running.getPipelineId(), running);
    }

    public Running findRunning(String pipelineId) {
        return (Running) hashOps.get(RUNNING, pipelineId);
    }

    public void saveKilled(final Killed killed) {
        hashOps.put(KILLED, killed.getPipelineId(), killed);
    }

    public void saveJob(final Job job) {
        hashOps.put(JOBS, job.getTxnId(), job);
    }

    public Map<String, Job> jobs() {
        return hashOps.entries(JOBS);
    }

    public void saveLog(final Log details) {
        listOps.rightPush(details.getTxnId(), details);
    }

    public List<Log> logs(final String txnId, final long from, final long to) {
        return listOps.range(txnId, from, to);
    }

    public List<Log> logs(final String txnId, final long recentN) {
        return listOps.range(txnId, -recentN, -1);
    }

    public Map<String, Running> findAllRunning() {
        return hashOps.entries(RUNNING);
    }

    public Map<String, Killed> findAllKilled() {
        return hashOps.entries(KILLED);
    }

    public void deleteRunning(final String pipelineId) {
        hashOps.delete(RUNNING, pipelineId);
    }

    public void updateJob(final String txnId) {
        Job job = (Job) hashOps.get(JOBS, txnId);
        job.setEnded(System.currentTimeMillis());
        saveJob(job);
    }

    public void deleteRunning() {
        redisTemplate.delete(RUNNING);
    }

    public void deleteLog() {
        redisTemplate.delete(LOG);
    }

    public void deleteJobs() {
        redisTemplate.delete(JOBS);
    }
}

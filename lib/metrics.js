/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx = require('pmx');
var Probe = pmx.probe();

var last_hits_nbr  = undefined;
var last_miss_nbr  = undefined;
var last_expi_nbr  = undefined;
var last_evict_nbr = undefined;
var WORKER_INTERVAL = undefined;

/** Constructor */
var Metrics = function (workerInterval) {
  var self = this;

  WORKER_INTERVAL = workerInterval;
  this.probes = {};
}

Metrics.prototype.probes = {};

/** Init all probes */
Metrics.prototype.initMetrics = function () {
  var self = this;

  this.probes.redisTcp = Probe.metric({
    name  : 'Redis tcp port',
    value : function() { return 'N/A'; }
  });

  this.probes.redisClients = Probe.metric({
    name  : 'Connected clients',
    value : function() { return 'N/A'; }
  });

  this.probes.redisMem = Probe.metric({
    name  : 'Used memory',
    value : function() { return 'N/A'; }
  });

  this.probes.redisUptime = Probe.metric({
    name  : 'Uptime',
    value : function() { return 'N/A'; }
  });

  this.probes.redisMemRss = Probe.metric({
    name  : 'Used memory rss',
    value : function() { return 'N/A'; }
  });

  this.probes.redisCmdSec = Probe.metric({
    name  : 'cmd/sec',
    value : function() { return 'N/A'; }
  });

  this.probes.redisHitsSec = Probe.metric({
    name  : 'hits/sec',
    value : function() { return 'N/A'; }
  });

  this.probes.redisMissSec = Probe.metric({
    name  : 'miss/sec',
    value : function() { return 'N/A'; }
  });

  this.probes.redisExpSec = Probe.metric({
    name  : 'exp/sec',
    value : function() { return 'N/A'; }
  });

  this.probes.redisEvtSec = Probe.metric({
    name  : 'evt/sec',
    value : function() { return 'N/A'; }
  });

  this.probes.redisProcId = Probe.metric({
    name  : 'Process Id',
    value : function() { return 'N/A'; }
  });

  this.probes.redisVersion = Probe.metric({
    name  : 'Redis Version',
    value : function() { return 'N/A'; }
  });
  
  this.probes.redisKeys = Probe.metric({
    name  : 'Total keys',
    value : function() { return 'N/A'; }
  });
}

Metrics.prototype.updateMetrics = function () {
  var instance = this;

  /** Update uptime metrics */
  client.info("server" ,function (err, reply) {
    if (err) return console.error(err);

    var redis_uptime_seconds = reply.match(/[\n\r].*uptime_in_seconds:\s*([^\n\r]*)/)[1];
    var redis_uptime_days = reply.match(/[\n\r].*uptime_in_days:\s*([^\n\r]*)/)[1] + ' days';
    var redis_uptime_hours = (redis_uptime_seconds/3600).toFixed(1) + ' hours';
    if (redis_uptime_hours > 48)
      instance.probes.redisUptime.set(redis_uptime_days);
    else
      instance.probes.redisUptime.set(redis_uptime_hours);
  })

  /** Update connected clients metrics */
  client.info("clients" ,function (err, reply) {
    if (err) return console.error(err);
      
    var connected_clients = reply.match(/[\n\r].*connected_clients:\s*([^\n\r]*)/)[1];
    instance.probes.redisClients.set(connected_clients);
  })

  /** Update memory metrics */
  client.info("memory" ,function (err, reply) {
    if (err) return console.error(err);

    var redis_mem_bytes = reply.match(/[\n\r].*used_memory:\s*([^\n\r]*)/)[1];
    var redis_mem = (redis_mem_bytes/1048576).toFixed(1) + 'MB';
    instance.probes.redisMem.set(redis_mem);

    var redis_mem_rss_bytes = reply.match(/[\n\r].*used_memory_rss:\s*([^\n\r]*)/)[1];
    var redis_mem_rss = (redis_mem_rss_bytes/1048576).toFixed(1) + 'MB';
    instance.probes.redisMemRss.set(redis_mem_rss);
  })

  /** Update all stats metrics */
  client.info("stats" ,function (err, reply) {
    if (err) return console.error(err);

    var redis_cmd_sec = parseInt(reply.match(/[\n\r].*instantaneous_ops_per_sec:\s*([^\n\r]*)/)[1]);
    instance.probes.redisCmdSec.set(redis_cmd_sec);

    /** Update nbr of key hits per secs */
    var current_hits_nbr = reply.match(/[\n\r].*keyspace_hits:\s*([^\n\r]*)/)[1];
    var redis_hits_sec = 'N/A';
    if (last_hits_nbr)
      redis_hits_sec = (current_hits_nbr - last_hits_nbr) / (WORKER_INTERVAL);
      
    last_hits_nbr = current_hits_nbr;
    instance.probes.redisHitsSec.set(redis_hits_sec);

    /** Update nbr of key misses per secs */
    var current_miss_nbr = reply.match(/[\n\r].*keyspace_misses:\s*([^\n\r]*)/)[1];
    var redis_miss_sec = 'N/A'
    if (last_miss_nbr)
      redis_miss_sec = (current_miss_nbr - last_miss_nbr) / (WORKER_INTERVAL);
      
    last_miss_nbr = current_miss_nbr;
    instance.probes.redisMissSec.set(redis_miss_sec);

    /** Update nbr of key expireds per secs */
    var current_expi_nbr = reply.match(/[\n\r].*expired_keys:\s*([^\n\r]*)/)[1];
    var redis_expi_sec = 'N/A'
    if (last_expi_nbr)
      redis_expi_sec = (current_expi_nbr - last_expi_nbr) / (WORKER_INTERVAL);
      
    last_expi_nbr = current_expi_nbr;
    instance.probes.redisExpSec.set(redis_expi_sec);

    /** Update nbr of key evicted per secs */
    var current_evict_nbr = reply.match(/[\n\r].*evicted_keys:\s*([^\n\r]*)/)[1];
    var redis_evict_sec = 'N/A'
    if (last_evict_nbr)
      redis_evict_sec = (current_evict_nbr - last_evict_nbr) / (WORKER_INTERVAL);
      
    last_evict_nbr = current_evict_nbr;
    instance.probes.redisEvtSec.set(redis_evict_sec);
  })

  /** Update nbr of keys contained on redis */
  client.info("keyspace", function (err, reply) {
    if (err) return console.error(err);

    var redis_keys = reply.match(/keys=[0-9]*/) + "";
    instance.probes.redisKeys.set(redis_keys.split("=")[1]);
  })
}

module.exports = Metrics;
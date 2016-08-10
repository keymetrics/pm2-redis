/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx     = require('pmx'),
    exec    = require('child_process').exec,
    redis   = require('redis');
    metrics = require('./lib/metrics');

var conf = pmx.initModule({
  pid    : pmx.resolvePidPaths(['/var/run/redis/redis-server.pid',
                                '/var/run/redis/redis.pid',
                                '/var/run/redis-server.pid',
                                '/var/run/redis.pid']),
  
  widget : {
    type : 'generic',
    logo : 'http://redis.io/images/redis-white.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme : ['#9F1414', '#591313', 'white', 'white'],

    el : {
      probes  : true,
      actions : true
    },

    block : {
      actions : true,
      issues  : true,
      meta    : false,
      main_probes : ['Total keys', 'cmd/sec', 'hits/sec', 'miss/sec', 'evt/sec', 'exp/sec']
    }
  }
}, function(err, conf) {

  var WORKER_INTERVAL = (conf.workerInterval * 1000) || 2000;
  var REDIS_PORT      = conf.port || process.env.PM2_REDIS_PORT;
  var REDIS_IP        = conf.ip || process.env.PM2_REDIS_IP;
  var REDIS_PWD       = conf.pwd || process.env.PM2_REDIS_PWD;
  
  client = redis.createClient(REDIS_PORT, REDIS_IP, {});

  if (conf.password !== '')
    client.auth(REDIS_PWD);

  // init metrics
  metrics.initMetrics();

  /** When the client is connected, start the worker */
  client.on("ready", function () {
    // set general redis metrics that doesnt change
    metrics.probes.redisTcp.set(client.server_info.tcp_port);
    metrics.probes.redisProcId.set(client.server_info.process_id);
    metrics.probes.redisVersion.set(client.server_info.redis_version);
    
    // start worker
    metrics.updateMetrics();
    setInterval(metrics.updateMetrics, WORKER_INTERVAL);
  });

  // register restart action
  pmx.action('restart', function(reply) {
    exec('/etc/init.d/redis-server restart', function (err, out, error) {
      if (err)
        return reply(err);
      return reply(out);
    });
  });

  // register restart action
  pmx.action('backup', function(reply) {
    exec('redis-cli bgsave', function (err, out, error) {
      if (err)
        return reply(err);
      return reply(out);
    });
  });
});

/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx         = require('@pm2/io'),
    exec        = require('child_process').exec,
    redis       = require('redis'),
    metricsMod  = require('./lib/metrics.js');

var conf = pmx.initModule({
  widget : {
    type : 'generic',
    logo : 'https://raw.githubusercontent.com/pm2-hive/pm2-redis/master/pres/redis-white.png',

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
  var REDIS_PORT      = process.env.PM2_REDIS_PORT || conf.port;
  var REDIS_IP        = process.env.PM2_REDIS_IP || conf.ip;
  var REDIS_PWD       = process.env.PM2_REDIS_PWD || conf.password;
  
  client = redis.createClient(REDIS_PORT, REDIS_IP, {});

  if (typeof(REDIS_PWD) === 'string')
    client.auth(REDIS_PWD);

  // construc metrics
  var metrics = new metricsMod(WORKER_INTERVAL);

  // init metrics
  metrics.initMetrics();

  /** When the client is connected, start the worker */
  client.on("ready", function () {
    // set general redis metrics that doesnt change
    metrics.probes.redisTcp.set(client.server_info.tcp_port);
    metrics.probes.redisProcId.set(client.server_info.process_id);
    metrics.probes.redisVersion.set(client.server_info.redis_version);
    
    // start worker
    metrics.updateMetrics(client);
    setInterval(metrics.updateMetrics.bind(metrics, client), WORKER_INTERVAL);
  });

  // register restart action
  pmx.action('restart', function(reply) {
    exec('/etc/init.d/redis-server restart', function (err, out, error) {
      return err ? reply(err) : reply(out);
    });
  });

  // register restart action
  pmx.action('backup', function(reply) {
    exec('redis-cli bgsave', function (err, out, error) {
      return err ? reply(err) : reply(out);
    });
  });
});

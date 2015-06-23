var redis = require('redis');
var pmx = require('pmx');

var Probe = pmx.probe();

var client = redis.createClient();

client.on("ready", function () {

  var redis_tcp = client.server_info.tcp_port;
  redisTcp.set(redis_tcp);

  (function firstLaunch() {
    
    var redis_clients = client.server_info.connected_clients;
    redisClients.set(redis_clients);

    var redis_mem_bytes = client.server_info.used_memory;
    var redis_mem = (redis_mem_bytes/1048576).toFixed(1) + 'MB';
    redisMem.set(redis_mem);

    var redis_mem_rss_bytes = client.server_info.used_memory_rss;
    var redis_mem_rss = (redis_mem_rss_bytes/1048576).toFixed(1) + 'MB';
    redisMemRss.set(redis_mem_rss);
  
    setTimeout(firstLaunch, 10000);
  })();

  setInterval(function () {

    var redis_cmd_sec = client.server_info.instantaneous_ops_per_sec;
    redisCmdSec.set(redis_cmd_sec);

  }, 1000)

  var redis_uptime_seconds = client.server_info.uptime_in_seconds;
  var redis_uptime_hours = (redis_uptime_seconds/3600).toFixed(1) + ' hours';
  redisUptime.set(redis_uptime_hours);
  
});

var redisTcp = Probe.metric({
  name  : 'Redis tcp port',
  value : function() { return 'N/A'; }
});

var redisClients = Probe.metric({
  name  : 'Connected clients',
  value : function() { return 'N/A'; }
});

var redisMem = Probe.metric({
  name  : 'Used memory',
  value : function() { return 'N/A'; }
});

var redisUptime = Probe.metric({
  name  : 'Redis Uptime server',
  value : function() { return 'N/A'; }
});

var redisMemRss = Probe.metric({
  name  : 'Used memory rss',
  value : function() { return 'N/A'; }
});

var redisCmdSec = Probe.metric({
  name  : 'Commands/sec',
  value : function() { return 'N/A'; }
});

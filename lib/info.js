var redis = require('redis');
var pmx = require('pmx');

var Probe = pmx.probe();

var client = redis.createClient();

(function firstLaunch() {

  client.info("server" ,function (err, reply) {
    var redis_uptime_seconds = reply.match(/[\n\r].*uptime_in_seconds:\s*([^\n\r]*)/)[1];
    var redis_uptime_days = reply.match(/[\n\r].*uptime_in_days:\s*([^\n\r]*)/)[1] + ' days';
    var redis_uptime_hours = (redis_uptime_seconds/3600).toFixed(1) + ' hours';
    if (redis_uptime_hours > 48)
      redisUptime.set(redis_uptime_days);
    else
      redisUptime.set(redis_uptime_hours);
  })

  client.info("clients" ,function (err, reply) {
    var connected_clients = reply.match(/[\n\r].*connected_clients:\s*([^\n\r]*)/)[1];
    redisClients.set(connected_clients);
  })

  client.info("memory" ,function (err, reply) {
    var redis_mem_bytes = reply.match(/[\n\r].*used_memory:\s*([^\n\r]*)/)[1];
    var redis_mem = (redis_mem_bytes/1048576).toFixed(1) + 'MB';
    redisMem.set(redis_mem);

    var redis_mem_rss_bytes = reply.match(/[\n\r].*used_memory_rss:\s*([^\n\r]*)/)[1];
    var redis_mem_rss = (redis_mem_rss_bytes/1048576).toFixed(1) + 'MB';
    redisMemRss.set(redis_mem_rss);
  })

  setTimeout(firstLaunch, 10000);
})();

setInterval(function () {

  client.info("stats" ,function (err, reply) {
    var redis_cmd_sec = reply.match(/[\n\r].*instantaneous_ops_per_sec:\s*([^\n\r]*)/)[1];
    redisCmdSec.set(redis_cmd_sec);

    var redis_hits_sec = reply.match(/[\n\r].*keyspace_hits:\s*([^\n\r]*)/)[1];
    redisHitsSec.set(redis_hits_sec);

    var redis_miss_sec = reply.match(/[\n\r].*keyspace_misses:\s*([^\n\r]*)/)[1];
    redisMissSec.set(redis_miss_sec);

    var redis_expi_sec = reply.match(/[\n\r].*expired_keys:\s*([^\n\r]*)/)[1];
    redisExpSec.set(redis_expi_sec);

    var redis_evi_sec = reply.match(/[\n\r].*evicted_keys:\s*([^\n\r]*)/)[1];
    redisEvtSec.set(redis_evi_sec);

  })

}, 1000)


client.on("ready", function () {

  var redis_tcp = client.server_info.tcp_port;
  redisTcp.set(redis_tcp);

  var redis_process_id = client.server_info.process_id;
  redisProcId.set(redis_process_id);
  
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
  name  : 'Uptime',
  value : function() { return 'N/A'; }
});

var redisMemRss = Probe.metric({
  name  : 'Used memory rss',
  value : function() { return 'N/A'; }
});

var redisCmdSec = Probe.metric({
  name  : 'cmd/sec',
  value : function() { return 'N/A'; }
});

var redisHitsSec = Probe.metric({
  name  : 'hits/sec',
  value : function() { return 'N/A'; }
});

var redisMissSec = Probe.metric({
  name  : 'miss/sec',
  value : function() { return 'N/A'; }
});

var redisExpSec = Probe.metric({
  name  : 'exp/sec',
  value : function() { return 'N/A'; }
});

var redisEvtSec = Probe.metric({
  name  : 'evt/sec',
  value : function() { return 'N/A'; }
});

var redisProcId = Probe.metric({
  name  : 'Process Id',
  value : function() { return 'N/A'; }
});

var redis = require('redis');
var pmx = require('pmx');

var Probe = pmx.probe();


client.on("ready", function () {
  var redis_version = client.server_info.redis_version;
  redisVersion.set(redis_version);
});

var redisVersion = Probe.metric({
  name  : 'Redis Version',
  value : function() { return 'N/A'; }
});

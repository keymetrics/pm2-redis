var redis = require('redis');
var shelljs = require('shelljs');
var pmx = require('pmx');

var Probe = pmx.probe();

var redisScan = require('redis-scanstreams')(redis);

var client = redis.createClient();
var toArray = require('stream-to-array')
 
setInterval( function () {
  toArray(client.scan(), function(err, arr) {
    if (err)
      throw err;

    redisScan.set(arr.length);
  })
}, 2000);

var redisScan = Probe.metric({
  name  : 'Total keys',
  value : function() { return 'N/A'; }
});


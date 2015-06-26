var redis = require('redis');
var shelljs = require('shelljs');
var numeral = require('numeral');
var pmx = require('pmx');

var Probe = pmx.probe();

require('redis-scanstreams')(redis);

var client = redis.createClient();
var toArray = require('stream-to-array');

setInterval( function () {
  toArray(client.scan(), function(err, arr) {
    if (err)
      throw err;
    var keys = arr.length;
    if(keys > 1000)
      keys = numeral(keys).format('0.0');
    redisScan.set(keys);
  });
}, 2000);

var redisScan = Probe.metric({
  name  : 'Total keys',
  value : function() { return 'N/A'; }
});

var scan = require('./lib/scan'),
    versions = require('./lib/versions'),
    pm2 = require('pm2'),
    info = require('./lib/info'),
    pmx     = require('pmx'),
    shelljs = require('shelljs'),
    fs      = require('fs'),
    path    = require('path');



var conf = pmx.initModule({

  pid              : pmx.resolvePidPaths(['/var/run/redis/redis-server.pid']),

  widget : {
    type             : 'generic',
    logo             : 'http://redis.io/images/redis-white.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme            : ['#9F1414', '#591313', 'white', 'white'],

    el : {
      probes  : true,
      actions : true
    },

    block : {
      actions : true,
      issues  : true,
      main_probes : ['Total keys', 'cmd/sec', 'hits/sec', 'miss/sec', 'evt/sec', 'exp/sec']
    }

    // Status
    // Green / Yellow / Red
  }
});

pmx.action('flush pm2 logs', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('pm2 flush');
  return reply(child);
});


pmx.action('throw error', { comment : 'Flush logs' } , function(reply) {
  pmx.notify(new Error('Failure'));
  return reply({success:true});
});

pmx.action('df', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('df');
  return reply(child);
});

pmx.action('restart server', { comment : 'Flush logs' } , function(reply) {
  var child = shelljs.exec('/etc/init.d/redis-server restart');
  return reply(child);
});

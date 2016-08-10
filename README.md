## Description

PM2 module to monitor a Redis server with Keymetrics

## Install

`pm2 install pm2-redis`

## Configure

- `workerInterval` (Defaults to `2` in secs) : You can control at which interval the worker is updating the stats (minimum is `1`)
- `ip` (Defaults to `127.0.0.1`): Set the host of your redis server (can be load from `PM2_REDIS_IP` env var)
- `port` (Defaults to `6379`): Set the port of your redis server (can be load from `PM2_REDIS_PORT` env var)
- `pwd` (Defaults to `none`): Set the password if you have activated the authentification (can be load from `PM2_REDIS_PWD` env var)

#### How to set these values ?

 After having installed the module you have to type :
`pm2 set pm2-redis: `

e.g: 
- `pm2 set pm2-redis:workerInterval 5` (every 5 seconds)
- `pm2 set pm2-redis:ip 42.42.42.42` (ip of my redis server)
- `pm2 set pm2-redis:pwd "bestpasswd"` (the password will be used to connect to redis)

## Uninstall

`pm2 uninstall pm2-redis`

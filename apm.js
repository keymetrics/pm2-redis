'use strict'

const generateUniqueId = _ => {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

const io = require('@pm2/io').init({ // eslint-disable-line
  standalone: true,
  publicKey: process.env.KM_PUBLIC_KEY,
  secretKey: process.env.KM_SECRET_KEY,
  appName: 'pm2-redis',
  serverName: generateUniqueId(),
  sendLogs: true,
  profiling: true,
  http: true
})

Syslogd
===

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

nodejs syslog server, including syslog message parser

Install
---

```sh
npm install syslogd
```

Usage
---

```js
var Syslogd = require('syslogd')
Syslogd(function(info) {
    /*
    info = {
          facility: 7
        , severity: 22
        , tag: 'tag'
        , time: Mon Dec 15 2014 10:58:44 GMT-0800 (PST)
        , hostname: 'hostname'
        , address: '127.0.0.1'
        , family: 'IPv4'
        , port: null
        , size: 39
        , msg: 'info'
    }
    */
}).listen(514, function(err) {
    console.log('start')
})
```

Check parser performance by `npm run performance`, which will run 500000 times

[npm-image]: https://img.shields.io/npm/v/syslogd.svg?style=flat-square
[npm-url]: https://npmjs.org/package/syslogd
[travis-image]: https://img.shields.io/travis/chunpu/syslogd.svg?style=flat
[travis-url]: https://travis-ci.org/chunpu/syslogd

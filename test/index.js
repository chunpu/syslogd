var dgram = require('dgram')
var assert = require('assert')
var Syslogd = require('../')

var time = 'Dec 15 10:58:44'
var testMsg = '<183>' + time + ' hostname tag: info'

Syslogd(function(info) {
    //console.log(info)
    info.port = null // port is random
    var shouldRet = {
          facility: 7
        , severity: 22
        , tag: 'tag'
        , time: new Date(time + ' ' + new Date().getFullYear())
        , hostname: 'hostname'
        , address: '127.0.0.1'
        , family: 'IPv4'
        , port: null
        , size: 39
        , msg: 'info'
    }
    assert.deepEqual(shouldRet, info)
    console.log('test pass!')
    process.exit(0)
}).listen(514, function(err) { // sudo
    console.log('listen', err)
    assert(!err)
    var client = dgram.createSocket('udp4')
    var buffer = new Buffer(testMsg)
    client.send(buffer, 0, buffer.length, 514, 'localhost', function(err, bytes) {
        console.log('send', err, bytes)
    })       
})



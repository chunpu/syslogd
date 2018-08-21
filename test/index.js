var dgram = require('dgram')
var assert = require('assert')
let mocha = require( 'mocha' )
var Syslogd = require('../')

describe( "given a syslogd service", () => {
	it( "recieves and processes messages", (done) => {
		var time = 'Dec 15 10:58:44'
		var testMsg = '<183>' + time + ' hostname tag: info'
		const port = 10514

		Syslogd(function(info) {
		    //console.log(info)
		    info.port = null // port is random
		    var shouldRet = {
			  facility: 22
			, severity: 7
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
			done()
		}).listen( port, function(err) { // sudo
		    //console.log('listen', err)
		    assert(!err)
		    var client = dgram.createSocket('udp4')
		    var buffer = new Buffer(testMsg)
		    client.send(buffer, 0, buffer.length, port, 'localhost', function(err, bytes) {
			//console.log('send', err, bytes)
		    })
		})
	})
})

// vim: set ft=javascript tabstop=4 softtabstop=4 shiftwidth=4 autoindent:
var assert = require('assert')
let mocha = require( 'mocha' )
var net = require('net')

describe( "given a TCP Syslog Server", () => {
	it( "Receives TCP/IP messages", (done) => {
		const StreamSyslogd = require('../').StreamService
		assert( StreamSyslogd, "StreamService not defined" )

		var time = 'Dec 15 10:58:44'
		var testMsg = '<183>' + time + ' hostname tag: info'
		const port = 10514

		StreamSyslogd(function(info) {
			info.port = null // port is random
			info.address = null
			info.family = null
			var shouldRet = {
				  facility: 7
				, severity: 22
				, tag: 'tag'
				, time: new Date(time + ' ' + new Date().getFullYear())
				, hostname: 'hostname'
				, address: null
				, family: null
				, port: null
				, size: testMsg.length
				, msg: 'info'
			}
			assert.deepEqual(shouldRet, info)
			done()
		}).listen( port, function(err) { // sudo
			assert.ifError( err )
			var buffer = new Buffer(testMsg)
			var client = net.connect( port, 'localhost', function() {
				client.write(buffer, function(err, bytes) {
					assert.ifError( err )
					client.end()
				})
			});
		})
	})
})


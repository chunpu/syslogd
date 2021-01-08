var dgram = require('dgram')
var assert = require('assert')
var Syslogd = require('../')

describe( "given a syslogd service", () => {
	it( "receives and processes messages", (done) => {
		var time = 'Dec 15 10:58:44'
		var testMsg = '<183>' + time + ' hostname tag: info'
		const port = 10514

		Syslogd(function(info) {
		    info.port = null // port is random
		    var shouldReturn = {
			  facility: 22
			, severity: 7
			, tag: 'tag'
			, time: new Date( time + ' ' + new Date().getFullYear() )
			, hostname: 'hostname'
			, address: '127.0.0.1'
			, family: 'IPv4'
			, port: null
			, size: testMsg.length
			, msg: 'info'
		    }
		    assert.deepStrictEqual( info, shouldReturn )
			done()
		}).listen( port, function(err) {
		    assert.ifError( err )
		    var client = dgram.createSocket( 'udp4' )
		    var buffer = Buffer.from( testMsg )
		    client.send( buffer, 0, buffer.length, port, 'localhost' )
		})
	})
	it( "decodes correctly with short PRI", (done) => {
		var time = 'May 29 14:52:40'
		var testMsg = '<4>' + time + ' hostname tag: info'
		const port = 10515

		Syslogd(function(info) {
		    info.port = null // port is random
		    var shouldReturn = {
			  facility: 0
			, severity: 4
			, tag: 'tag'
			, time: new Date( time + ' ' + new Date().getFullYear() )
			, hostname: 'hostname'
			, address: '127.0.0.1'
			, family: 'IPv4'
			, port: null
			, size: testMsg.length
			, msg: 'info'
		    }
		    assert.deepStrictEqual( info, shouldReturn )
			done()
		}).listen( port, function(err) {
		    assert.ifError( err )
		    var client = dgram.createSocket( 'udp4' )
		    var buffer = Buffer.from( testMsg )
		    client.send( buffer, 0, buffer.length, port, 'localhost' )
		})
	})
})

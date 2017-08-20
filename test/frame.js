let mocha = require( "mocha" )
let assert = require('assert')
let syslogd = require('../')
let FrameParser = syslogd.FrameParser

describe( "StreamFrameParser", () => {
	var frames
	var parser

	beforeEach( () => {
		frames = []
		parser = new FrameParser( ( frame ) => {
			frames.push( frame )
			//console.log( "Frame", frames.length, " '"+ frame + "'" )
		} )
	})

	describe( "when closed before receiving data", () => {
		it( "doesn't emit frames", () => { assert.equal( frames.length, 0 ) } )
	})

	describe( "given a complete new line frame", () => {
		beforeEach( () => {
			parser.feed( Buffer.from( "nontransparent newline\n" ) )
		})

		it( "adds a frame", () => { assert.equal( frames.length, 1) })
		it( "correctly copies the frame", () => { assert.equal( frames[0], "nontransparent newline" ) })

		describe( "when the stream is complete", () => {
			it( "doesn't emit a new frame", () => { assert.equal( frames.length, 1 ) } )
		})
	})

	describe( "when given a partial new line frame", () => {
		beforeEach( () => {
			parser.feed( Buffer.from( "not done" ) )
		})

		it( "does not emit the frame yet", () => { assert.equal( frames.length, 0 ) })

		describe( "when given the completed part",  () => {
			beforeEach( () => {
				parser.feed( Buffer.from( " yet\n" ) )
			})

			it( "completes the frame", () => { assert.equal( frames.length, 1) } )
			it( "ensure frame content correct", () => { assert.equal( frames[0], "not done yet" ) } )
		})

		describe( "when finished with additional frames", () => {
			beforeEach( () => { parser.feed( Buffer.from( "here\nwith another\nframe" ) ) })

			it( "it only completed two frames", () => { assert.equal( frames.length, 2) } )
			it( "frame 1 is complete", () => { assert.equal( frames[0], "not donehere" ) } )
			it( "frame 2 is correct", () => { assert.equal( frames[1], "with another" ) } )

			describe( "when the stream is done", () => {
				beforeEach( () => { parser.done() } )
				it( "yeilds another frame", () => { assert.equal( frames.length, 3 ) } )
				it( "yeilds leftover content", () => { assert.equal( frames[2], "frame" ) } )
			})
		})
	})

	describe( "when given multiple new line frames", () => {
		beforeEach( () => {
			parser.feed( Buffer.from( "multiple frames\nwithin a single\nbuffer" ) )
		} )

		it( "emits all frames", () => { assert.equal( frames.length, 2 ) })
		it( "emits the frames in correct order", () => {
			assert.equal( frames[0],  "multiple frames" )
			assert.equal( frames[1],  "within a single" )
		})
	})

	describe( "when given an octet counted frame", () => {
		const message = "<12>1 2017-05-26T14:05:00.000Z host proc 42 - - - Some message"
		beforeEach( () => {
			let length = message.length
			parser.feed( Buffer.from( length + " " + message ) )
		})

		it( "emits a frame", () => { assert.equal( frames.length, 1 ) } )
		it( "emits only the framed contents", () => { assert.equal( frames[0], message ) } )
	})

	describe( "when given mutliple octet frames", () => {
		const message1 = "<12>1 2017-05-26T14:05:00.000Z host proc 42 - - - Some message"
		const message2 = "<18>1 2017-05-26T14:31:00.123Z host proc 42 - - - Secon messages"
		beforeEach( () => {
			parser.feed( Buffer.from( message1.length + " " + message1 + message2.length + " " + message2 ) )
		})

		it( "emits a frame", () => { assert.equal( frames.length, 2 ) } )
		it( "emits the first message", () => { assert.equal( frames[0], message1 ) } )
		it( "emits the second message", () => { assert.equal( frames[1], message2 ) } )
	})
})


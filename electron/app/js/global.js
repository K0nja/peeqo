'use strict'

require('app-module-path').addPath(__dirname)

const event = require('js/events/events')
const listen = require('js/senses/listen')
const Eyes = require('js/face/eyes')
const speak = require('js/senses/speak')
const buttons = require('js/senses/buttons')
const remote = require('electron').remote

const listeners = require('js/events/listeners')()

// keyboard shortcuts
document.addEventListener("keydown", (e)=>{
	if(e.which == 123){
		//F12 show js console
		remote.getCurrentWindow().toggleDevTools()
	} else if(e.which == 116){
		//F5 refresh page
		location.reload()
	}
})

// set audio levels
event.emit('set-volume',0.4)

// initiate eyes
const eyes = new Eyes()

event.emit('show-div', 'eyeWrapper')
event.emit('start-blinking')

setTimeout(()=>{
	
},3000)

// initiate buttons
buttons.initializeButtons()

//initiate leds
const leds = require('js/senses/leds')

// initiate camera
const camera = require('js/senses/camera')

// initiate listening
listen.startListening()
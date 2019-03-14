'use strict'

const record = require('node-record-lpcm16')
const path = require('path')
const os = require('os')
const config = require(path.join(process.cwd(),'app','config','config.js'))

const {Detector, Models} = require('snowboy')

const event = require('js/events/events')

const dialogflow = require('js/intent-engines/dialogflow')

function setupSnowboy(){
	//SNOWBOY WAKEWORD DETECTOR

	const models = new Models()

	models.add({
		file: path.join(process.cwd(),'app','config',config.speech.model),
		sensitivity: config.speech.sensitivity,
		hotwords: config.speech.wakeword
	})

	const wakewordDetector = new Detector({
		resource: path.join(process.cwd(), 'app', 'config', 'common.res'),
		models: models,
		audioGain: 2.0
	})

	return wakewordDetector
}

function setupRecorder(){
	// MIC RECORDER

	const recorder = (os.arch()=='arm')?'arecord':'rec' // use arecord on pi, rec on laptop

	const recorderOpts={
		verbose: false,
		threshold:0,
		recordProgram: recorder,
		sampleRateHertz: 16000
	}

	return {recorder, recorderOpts}
}


function startListening(){
	
	const wakewordDetector = setupSnowboy()

	const {recorder, recorderOpts} = setupRecorder()

	const {sessionClient, dialogflowRequest} = dialogflow.setup()
	
	//start mic
	const mic = record.start(recorderOpts)

	// WAKEWORD SNOWBOY EVENTS
	wakewordDetector.on('unpipe', (src) => {
		console.log("STOPPED PIPING > WAKEWORD")
	})

	wakewordDetector.on('pipe', (src) => {
		console.log("PIPING > WAKEWORD")
	})

	wakewordDetector.on('error', (err) => {
		console.error("WAKEWORD ERROR: ", err)
	})

	wakewordDetector.on('close', () => {
		console.log("WAKEWORD PIPE CLOSED")
	})

	wakewordDetector.on('hotword', (index, hotword) => {

		console.log("WAKEWORD > DETECTED")

		event.emit("wakeword")

		//unpipe recording from wakeword listener
		mic.unpipe(wakewordDetector)
	})

	event.on('speech-to-text', () => {
		//pipe mic to speech to text engine
		let stt = new dialogflow.DialogflowSpeech(mic, sessionClient, dialogflowRequest, wakewordDetector)
		
		event.emit('start-stt')

	})

	mic.pipe(wakewordDetector)
}

module.exports = {
	startListening
}



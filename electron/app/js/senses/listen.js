'use strict'

const path = require('path')
const config = require('config/config')
const { Porcupine } = require('@picovoice/porcupine-node')
const { PvRecorder } = require('@picovoice/pvrecorder-node')
const event = require('js/events/events')

let porcupine = null
let recorder = null
let listening = false

function startListening() {
    const accessKey = config.speech.porcupineAccessKey
    const keywordPath = path.join(process.cwd(), 'app', 'config', config.speech.model)

    porcupine = new Porcupine(
        accessKey,
        [keywordPath],
        [config.speech.sensitivity]
    )

    // -1 = default audio device
    recorder = new PvRecorder(-1, porcupine.frameLength)
    recorder.start()
    listening = true

    console.log("WAKEWORD > Porcupine listening...")

    async function listenLoop() {
        while (listening) {
            const pcmFrame = await recorder.read()
            const keywordIndex = porcupine.process(pcmFrame)
            if (keywordIndex >= 0) {
                console.log("WAKEWORD > DETECTED")
                event.emit("wakeword")
            }
        }
    }

    listenLoop().catch(err => console.error("WAKEWORD ERROR:", err))
}

function stopListening() {
    listening = false
    if (recorder) {
        recorder.stop()
        recorder.release()
    }
    if (porcupine) {
        porcupine.release()
    }
}

module.exports = { startListening, stopListening }
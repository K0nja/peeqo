'use strict'

const path = require('path')
const config = require('config/config')
const { Porcupine } = require('@picovoice/porcupine-node')
const record = require('node-record-lpcm16')
const event = require('js/events/events')

let porcupine = null
let listening = false

function startListening() {
    const accessKey = config.speech.porcupineAccessKey
    const keywordPath = path.join(process.cwd(), 'app', 'config', config.speech.model)

    porcupine = new Porcupine(
        accessKey,
        [keywordPath],
        [config.speech.sensitivity]
    )

    const frameLength = porcupine.frameLength
    const sampleRate = porcupine.sampleRate
    let buffer = Buffer.alloc(0)

    const stream = record.start({
        sampleRate,
        channels: 1,
        audioType: 'raw',
        encoding: 'signed-integer',
        bits: 16
    })

    listening = true
    console.log("WAKEWORD > Porcupine listening...")

    stream.on('data', (chunk) => {
        if (!listening) return
        buffer = Buffer.concat([buffer, chunk])
        const bytesPerFrame = frameLength * 2 // 16-bit = 2 bytes per sample
        while (buffer.length >= bytesPerFrame) {
            const frameBuffer = buffer.slice(0, bytesPerFrame)
            buffer = buffer.slice(bytesPerFrame)
            const pcmFrame = new Int16Array(frameBuffer.buffer, frameBuffer.byteOffset, frameLength)
            const keywordIndex = porcupine.process(pcmFrame)
            if (keywordIndex >= 0) {
                console.log("WAKEWORD > DETECTED")
                event.emit("wakeword")
            }
        }
    })

    stream.on('error', (err) => console.error("WAKEWORD ERROR:", err))
}

function stopListening() {
    listening = false
    record.stop()
    if (porcupine) {
        porcupine.release()
        porcupine = null
    }
}

module.exports = { startListening, stopListening }

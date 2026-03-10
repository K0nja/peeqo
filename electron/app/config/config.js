const os = require('os')

const porcupineModel = os.arch() === 'arm' || os.arch() === 'arm64'
    ? "Hey-Pico_en_raspberry-pi_v4_0_0.ppn"   // Raspberry Pi ARM
    : "Hey-Pico_en_linux_v4_0_0.ppn"           // Linux x86_64 - download from console.picovoice.ai

module.exports = {
	giphy:{
		key:'HNJNfFOgTHkpXHf5JpcE2EuSmQIbPzmF', // get your own from https://developers.giphy.com/docs/
		max_gif_size: 800000, // max gif size it should try to download
        max_mp4_size: 700000  // max video size it should try to download
	},
	speech: {
    porcupineAccessKey: 'HruWZ70kg7axHWUYarnnG15SyfYkT4Jd3La7TCWFHA4Xto5zXtxuZw==', // from console.picovoice.ai
    projectId: 'peeqo-awgm',
    dialogflowKey: 'dialogflow.json',
    wakeword: "peeqo",
    language: "en-US",
    model: porcupineModel,
    sensitivity: 0.5,
    continuous: false
    },
    fileExtensions: [".gif", ".mp4", ".webp"], // list of supported file types
    server: "", //"http://localhost:3000"
    openweather: {
        key: "a90ba2f57cea63561ab30990f081b968", // please get api key from https://openweathermap.org/api
        city: 'Detroit' // default city to search - change it to your city of choice
    },
    spotify:{
        clientId:"", // get from https://developer.spotify.com/dashboard/applications
        clientSecret:""
    },
    vlipsy:{
        key:"" // request for api key by emailing api@vlipsy.com
    }
}
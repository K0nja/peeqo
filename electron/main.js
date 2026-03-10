'use strict'

const {app, BrowserWindow } = require('electron')
const os = require('os')


var createWindow = () => {
	let mainWindow = new BrowserWindow({
        width: 800,
        height: 480,
        webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
        }
})

	// display index.html
	mainWindow.loadURL('file://'+__dirname+'/app/index.html')

	// handle keyboard shortcuts from renderer
	mainWindow.webContents.on('before-input-event', (event, input) => {
		if (input.type === 'keyDown' && input.key === 'F12') {
			mainWindow.webContents.toggleDevTools()
			event.preventDefault()
		}
	})

	if(os.arch() == 'arm'){

		// For Raspberry Pi

		if(process.env.NODE_ENV == "debug"){
			// open console only if NODE_ENV=debug is set
			mainWindow.webContents.openDevTools();
		}

		// make application full screen
		mainWindow.setMenu(null);
		mainWindow.setFullScreen(true);
		mainWindow.maximize();

	} else {

		// For Desktop OS - Mac, Windows, Linux

		// always open console on dev machine
		mainWindow.webContents.openDevTools();

	}
}

app.on('ready', createWindow)

app.on('window-all-closed', ()=>{
	app.quit()
})

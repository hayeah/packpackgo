'use strict'
const {
  app
} = require('electron')
const WindowManager = require('./lib/window')
const windowManager = new WindowManager()

let mainWindow
app.on('ready', () => {
  mainWindow = windowManager.createWindow()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    mainWindow = windowManager.createWindow()
  }
})
'use strict'
const path = require('path')
const {
  app
} = require('electron')
const WindowManager = require('./lib/window')
const windowManager = new WindowManager()

const isDev = process.env.NODE_ENV === 'development'
const url = isDev ?
  `file://${path.join(__dirname, '../index.dev.html')}` :
  `file://${path.join(__dirname, '../index.html')}`

let mainWindow

app.on('ready', () => {
  mainWindow = windowManager.createWindow(url)
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
    mainWindow = windowManager.createWindow(url)
  }
})
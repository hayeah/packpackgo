'use strict'
const path = require('path')
const {
  BrowserWindow
} = require('electron')

const isDev = process.env.NODE_ENV === 'development'

module.exports = class Window {
  createWindow(
    url = `file://${path.join(__dirname, '../index.html')}`, 
    options = {}
  ) {
    const win = new BrowserWindow(Object.assign({
      width: 800, 
      height: 600
    }, options))

    win.loadURL(url)

    if (isDev) {
      const installExtension = require('electron-devtools-installer')
      installExtension.default(installExtension.VUEJS_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
    }

    return win
  } 
}
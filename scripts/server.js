'use strict'
const path = require('path')
const webpack = require('webpack')
const express = require('express')
const config = require('./webpack.dev')

const app = express()

const port = 8080
config.entry.client.push(
  `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr` 
)
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

const compiler = webpack(config)
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

'use strict'
const webpack = require('webpack')
const config = require('./webpack.base')

config.devtool = 'cheap-module-eval-source-map'
config.plugins.push(
  new webpack.DefinePlugin({
    '__DEV__': true,
    'process.env.NODE_ENV': JSON.stringify('development')
  })
)

module.exports = config
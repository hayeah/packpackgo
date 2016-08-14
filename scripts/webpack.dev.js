'use strict'
const webpack = require('webpack')
const config = require('./webpack.base')

config.devtool = 'cheap-module-eval-source-map'
config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.NoErrorsPlugin()
)

module.exports = config
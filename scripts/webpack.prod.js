'use strict'
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.base')

config.plugins.push(
  new webpack.DefinePlugin({
    '__DEV__': false,
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    comments: false
  }),
  new ExtractTextPlugin('styles.css'),
)
config.vue.loaders.css = ExtractTextPlugin.extract('vue-style-loader', 'css-loader')

module.exports = config
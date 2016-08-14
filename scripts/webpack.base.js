'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const pkg = require('../package')

module.exports = {
  entry: {
    client: './src/index.js',
    vendor: Object.keys(pkg.dependencies).filter(name => {
      // update the code if you want to
      // remove some dependencies you don't need in the vendor bundle
      return true
    })
  },
  output: {
    path: path.join(__dirname, '../app/dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.vue', '.css', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: [/node_modules/]
      },
      {
        test: /\.vue$/,
        loaders: ['vue']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  babel: {
    babelrc: false,
    presets: [
      ['es2015', {modules: false}]
      , 'stage-1'
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract({
        loader: 'css-loader',
        fallbackLoader: 'vue-style-loader'
      })
    }
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.ExternalsPlugin('commonjs2', [
      'webpack'
    ])
  ],
  target: 'electron-renderer'
}
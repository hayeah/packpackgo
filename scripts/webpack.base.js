'use strict'
const path = require('path')
const webpack = require('webpack')
const WebpackNotifierPlugin = require('webpack-notifier')
const pkg = require('../package')

const moduleBlackList = []

module.exports = {
  entry: {
    client: ['./src/index.js'],
    vendor: Object.keys(pkg.dependencies).filter(name => {
      return moduleBlackList.indexOf(name) === -1
    })
  },
  output: {
    path: path.join(__dirname, '../app/dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['', '.vue', '.css', '.js', '.json'],
    alias: {
      src: path.join(__dirname, '../src'),
      components: path.join(__dirname, '../src/components'),
      svg: path.join(__dirname, '../src/svg'),
      utils: path.join(__dirname, '../src/utils')
    }
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
      },
      {
        test: /\.svg$/,
        loaders: ['svg-inline']
      }
    ]
  },
  babel: {
    babelrc: false,
    presets: [
      'es2015'
      , 'stage-1'
    ]
  },
  vue: {
    loaders: {},
    postcss(webpack) {
      return [
        require('postcss-import')({
          addDependencyTo: webpack
        }),
        require('postcss-nested'),
        require('postcss-simple-vars')
      ]
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.ExternalsPlugin('commonjs2', [
      'webpack',
      'webpack-dev-middleware',
      'webpack-hot-middleware',
      'express'
    ]),
    new WebpackNotifierPlugin({
      title: pkg.name
    })
  ],
  target: 'electron-renderer'
}

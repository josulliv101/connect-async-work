/* eslint-disable */
const path = require('path');

module.exports = {
  entry: './client.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: __dirname
    }]
  }
}

var src = path.join(__dirname, '..', '..')
var fs = require('fs')
if (fs.existsSync(src)) {
  // Use the latest src
  module.exports.resolve = { alias: { '@josulliv101/connect-async-work': src } }
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: src
  });
}

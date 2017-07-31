/* eslint-disable */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map',
  entry: './client.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/__build__/'
  },
  resolve: { 
    extensions: ['', '.js', '.jsx','.css','.woff', '.woff2', '.eot','.ttf','.svg']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: { plugins: [] }
    }, {
      test: /\.css$/,
      loader: 'style!css',
      // exclude: /node_modules/
    },{
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // loader: "url?limit=10000"
        loader: "url"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      }]
  }
}

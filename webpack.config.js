const webpack = require('webpack')

module.exports = {
  output: {
    library: 'AsyncSwitch',
    libraryTarget: 'umd'
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config'
//
import serverRender from './serverRender'

const app = express()
const compiler = webpack(webpackConfig)

app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true
  }
}))

app.use(serverRender)

app.listen(8080, function () {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})

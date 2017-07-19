const fs = require('fs')
const execSync = require('child_process').execSync
const inInstall = require('in-publish').inInstall
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

if (inInstall())
  process.exit(0)

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS modules ...')

exec('babel modules -d lib/cjs --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')

exec('babel modules -d lib/es --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding connect-async-work.js ...')

exec('webpack modules/index.js lib/umd/connect-async-work.js', {
  NODE_ENV: 'production'
})

console.log('\nBuilding connect-async-work.min.js ...')

exec('webpack -p modules/index.js lib/umd/connect-async-work.min.js', {
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('lib/umd/connect-async-work.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
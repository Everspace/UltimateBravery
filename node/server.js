var path = require('path')
var fs = require('fs')
var express = require('express')

var app = express()
var webpack = require('webpack')
var config = require('./webpack/webpack.config.dev.js')
var compiler = webpack(config)
app.use(require('connect-history-api-fallback')({verbose: false}))

app.use(
  require('webpack-dev-middleware')(compiler, {
    color: true,
    stats: {
      colors: true,

      assets: true,
      chunks: false,
      errors: true,
      errorDetails: true,
      warnings: true
    },
    // noInfo: true,
    publicPath: config.output.publicPath
  })
// In case of emergencies
// ,require('body-parser').json()
)
app.use(require('webpack-hot-middleware')(compiler))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.ejs'))
})

const pushToStatic = (req, res) => {
  res.sendFile(path.join(__dirname, 'static', req.originalUrl))
}

[
  '/favicon/*',
  '/img/*',
  '/json/*',
  /\/favicon\.(png|ico)/
].forEach((address) => {
  app.get(address, pushToStatic)
})

var server = app.listen(9001, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:%d', server.address().port)
})
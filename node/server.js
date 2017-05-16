var path = require('path')
var express = require('express')

var app = express()

var webpack = require('webpack')
var config = require('./webpack/webpack.config.dev.js')
var compiler = webpack(config)

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }),
  require('webpack-hot-middleware')(compiler)
// In case of emergencies
// ,require('body-parser').json()
)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.ejs'))
})

// In case of emergencies
// app.post('/console', function (req, res) {
//   console.log(req.body.value)
//   res.sendStatus(200)
// })

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'static', req.originalUrl))
})


var server = app.listen(9001, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:%d', server.address().port)
})

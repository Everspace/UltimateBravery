var path = require('path')

var webpack = require('webpack')
var config = require('./webpack/webpack.config.dev.js')

var WebpackDevServer = require('webpack-dev-server')

new WebpackDevServer(webpack(config),
  {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
).listen(9001, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Listening at localhost:9001')
})

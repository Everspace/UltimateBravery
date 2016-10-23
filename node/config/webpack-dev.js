var path = require('path');
var webpack = require('webpack');

var sourceDirectory = path.resolve(__dirname, '..', 'src');
var outputDir       = path.resolve(__dirname, '..', 'build');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:9001/',
    'webpack/hot/only-dev-server',
    './src/main'
  ],

  resolve: {
    root: sourceDirectory,
    extensions: ['', '.js', '.css']
  },

  output: {
    path: outputDir,
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: sourceDirectory
    },{
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      //include: path.resolve(__dirname, '..', 'src')
    }]
  }
};
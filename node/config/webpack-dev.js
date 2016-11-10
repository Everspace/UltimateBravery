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
    extensions: ['', '.js', '.less']
  },

  output: {
    path: outputDir,
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: sourceDirectory
    },
    {
      test: /\.less$/,
      loaders: ['style', 'css', 'less']
    }]
  }
};

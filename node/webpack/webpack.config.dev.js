var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: path.resolve(__dirname, '..', 'src'),
  entry: [
    // activate HMR for React
    'react-hot-loader/patch',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-hot-middleware/client',

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    // App
    './main.js'
  ],

  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    rules: require('./webpack.loaders.js')
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    new webpack.NoEmitOnErrorsPlugin(), // do not emit compiled assets that include errors
    new ExtractTextPlugin('style.css'),

    new webpack.DefinePlugin({
      'environment': 'development',
      NODE_ENV: JSON.stringify('development')
    }),

    new HtmlWebpackPlugin({
      title: 'ULTIMATE BRAVERY!!!',
      template: path.join('public', 'index.ejs')
    })
  ],

  resolve: {
    modules: ['node_modules', 'src'],
    alias: {
      // for use in less due to a quirk that requires a '~<IDENTIFIER>/' to use the files relative to src
      '#': path.resolve(__dirname, '..', 'src')
    },
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
}

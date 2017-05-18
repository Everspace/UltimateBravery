var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:9001',

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    // activate HMR for React
    'react-hot-loader/patch',


    // App
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
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
      'environment': '"development"',
      NODE_ENV: JSON.stringify('development')
    }),

    new HtmlWebpackPlugin({
      title: 'ULTIMATE BRAVERY!!!',
      template: path.join('src', 'public', 'index.ejs')
    })
  ],

  resolve: {
    modules: ['node_modules', 'src'],
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
}

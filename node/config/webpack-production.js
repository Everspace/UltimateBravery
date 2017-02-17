var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var sourceDirectory = path.resolve(__dirname, '..', 'src');
var outputDir       = path.resolve(__dirname, '..', 'build');

module.exports = {
  entry: './src/main.js',

  output: {
    path: outputDir,
    filename: 'bundle.js'
  },

  resolve: {
    root: sourceDirectory,
    extensions: ['', '.js', '.less']
  },

  plugins: [
  	new webpack.optimize.UglifyJsPlugin({
  		compress: {
  			screw_ie8: true,
  	        sequences: true,
  	        dead_code: true,
  	        conditionals: true,
  	        booleans: true,
  	        unused: true,
  	        if_return: true,
  	        join_vars: true,
  	        drop_console: true
        	},
  		mangle: {
  			screw_ie8: true,
  			except: [
          '$' /*sacred is the jquery*/,
          'require',
          'exports'
        ]
  		},
  		output: {
  			comments: false
  		}

  	}),
  	new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('style.css')
  ],

  module: {
    loaders: [{
        test: /\.js$/,
        loaders: ['babel'],
        include: sourceDirectory
      },{
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(['css', 'less']),
        include: sourceDirectory
      }
    ]
  }
};


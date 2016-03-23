var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/UltimateBravery.js',

  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'bundle.js'
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
			except: ['$','require','exports']
		},
		output: {
			comments: false
		}

	}),
	new webpack.optimize.OccurrenceOrderPlugin()
  ],
  
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.resolve(__dirname, '..', 'src')
    }]
  }
};


var ExtractTextPlugin = require('extract-text-webpack-plugin')

var jsFiles = {
  // Find the files with this extension
  test: /\.js$/,
  // Skip this
  exclude: /node_modules/,
  // Then apply the appropreate loaders
  use: [{
    loader: 'babel-loader'
    // There is also a query option to
    // pass stuff that is normally in the
    // .babelrc file, but jest doesn't like that
    // so into the .babelrc file it goes instead
  }]
}

var lessLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[local]--[hash:base64:5]'
    }
  },
  {
    loader: 'less-loader'
  }
]

var lessFiles = {
  test: /\.less$/,
  use: (
    (process.env.NODE_ENV === 'production')
      ? ExtractTextPlugin.extract({use: lessLoaders})
      : [{loader: 'style-loader'}, ...lessLoaders]
  )
}

module.exports = [
  jsFiles,
  lessFiles
]

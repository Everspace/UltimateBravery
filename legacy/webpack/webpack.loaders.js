var ExtractTextPlugin = require("extract-text-webpack-plugin")

var jsFiles = {
  // Find the files with this extension
  test: /\.jsx?$/,
  // Skip this
  exclude: /node_modules/,
  // Then apply the appropreate loaders
  use: [{
    loader: "babel-loader"
    // There is also a query option to
    // pass stuff that is normally in the
    // .babelrc file, but jest doesn't like that
    // so into the .babelrc file it goes instead
  }]
}

var cssLoaders = [
  {
    loader: "css-loader"
    // , TODO: Add modules back in
    // options: {
    //   modules: true,
    //   localIdentName: '[local]--[hash:base64:5]'
    // }
  }
]

var cssFiles = {
  test: /\.css$/,
  use: (
    (process.env.NODE_ENV === "production") ?
      ExtractTextPlugin.extract({use: cssLoaders})
      : [{loader: "style-loader"}, ...cssLoaders]
  )
}

module.exports = [
  jsFiles,
  cssFiles
]

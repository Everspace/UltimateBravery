var path = require("path")
var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  context: path.resolve(__dirname, "..", "src"),
  entry: ["./main.js"],
  output: {
    path: path.join(__dirname, "..", "build"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: require("./webpack.loaders.js")
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      "environment": "\"production\"",
      NODE_ENV: JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      screw_ie8: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        warnings: false
      },
      mangle: {
        except: [
          "$" /* sacred is the jquery */,
          "require",
          "exports"
        ]
      },
      output: {
        comments: false
      }
    }),
    new HtmlWebpackPlugin({
      title: "ULTIMATE BRAVERY!!!",
      minify: {
        html5: true,
        removeComments: true
      },
      template: path.join("public", "index.ejs")
    })
  ],

  resolve: {
    modules: ["node_modules", "src"],
    extensions: [".js", ".jsx", ".json"],
    alias: {
      // for use in less due to a quirk that requires a '~<IDENTIFIER>/' to use the files relative to src
      "#": path.resolve(__dirname, "..", "src")
    },
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
}

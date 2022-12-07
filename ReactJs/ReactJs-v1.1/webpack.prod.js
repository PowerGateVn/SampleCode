const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");

module.exports = merge(require("./webpack.config")("production"), {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "scripts/bitwage.[name].[hash].bundle.js",
    sourceMapFilename: "scripts/bitwage.[name].[chunkhash].bundle.map",
    chunkFilename: "scripts/bitwage.[id].[chunkhash].chunk.js",
    path: path.resolve(__dirname, "./build/dist")
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
});

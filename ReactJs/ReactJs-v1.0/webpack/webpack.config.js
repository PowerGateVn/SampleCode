const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, '../src'),

  entry: {
    app: './root.jsx'
  },

  output: {
    filename: '[name]-bundle.js',
    chunkFilename: '[name]-[hash].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader?name=/assets/images/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },

  resolve: {
    alias: {},
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, '../src'),
      'node_modules'
    ]
  },

  plugins: [

    new LodashModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]
};

'use strict';

const path = require('path');

module.exports = {
  entry: './client/index',

  mode: 'development',

  target: 'electron-renderer',

  output: {
    filename: 'vendor.js',
    path: path.join(__dirname, 'public'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|html|ttf|woff2|woff|eot)$/,
        use: ['file-loader?name=[name].[ext]'],
      },

      {
        test: /.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },

  devtool: 'source-map',

  devServer:  {
    port: 5000,
  },
};

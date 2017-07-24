'use strict';

const path = require('path');

module.exports = {
  entry: './client/index',

  output: {
    filename: 'vendor.js',
    path: path.join(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader', options: { presets: ['react'] } }
      },

      { test: /\.(png|svg|jpg|gif|html)$/, use: ['file-loader?name=[name].[ext]'], }
    ]
  }
};
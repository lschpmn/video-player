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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [ 'transform-object-rest-spread' ],
            presets: ['react', 'env'],
          },
        }
      },

      {test: /\.(png|svg|jpg|gif|html)$/, use: ['file-loader?name=[name].[ext]'],}
    ]
  },

  devServer: {
    port: 5000,
  },
};
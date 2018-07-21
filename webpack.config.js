'use strict';

const path = require('path');

module.exports = {
  entry: './client/index',

  output: {
    filename: 'vendor.js',
    path: path.join(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
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

      {
        test: /\.(png|svg|jpg|gif|html|ttf|woff2|woff|eot)$/,
        use: ['file-loader?name=[name].[ext]'],
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },

      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ]
  },

  devServer: {
    port: 5000,
  },
};
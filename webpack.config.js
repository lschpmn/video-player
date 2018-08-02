'use strict';

const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './client/index'],

  mode: 'development',

  output: {
    filename: 'vendor.js',
    path: path.join(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-object-rest-spread'],
            presets: ['react', 'env'],
          },
        },
      },

      {
        test: /\.(png|svg|jpg|gif|html|ttf|woff2|woff|eot)$/,
        use: ['file-loader?name=[name].[ext]'],
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['transform-object-rest-spread'],
              presets: ['react', 'env'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },

  devtool: 'source-map',

  serve: {
    port: 5000,
  },
};
'use strict';

const path = require('path');

module.exports = {
  entry: ['react-hot-loader/patch', './client/index'],

  mode: 'development',

  target: 'electron-renderer',

  output: {
    filename: 'vendor.js',
    path: path.join(__dirname, 'public'),
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              'react-hot-loader/babel',
            ],
          },
        },
      },
    ],
  },

  devtool: 'source-map',
};

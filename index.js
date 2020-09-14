'use strict';

const { app, BrowserWindow } = require('electron');
const getIncrementalPort = require('get-incremental-port');
const _ = require('lodash');
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const { join } = require('path');

let port;
let win;

const IS_PROD = process.argv.includes('--prod');
const openWindow = _.after(2, createWindow);

(async function () {
  port = await getIncrementalPort(5000);
  const options = {
    contentBase: './public',
    hot: true,
    host: '127.0.0.1',
  };

  if (!IS_PROD) {
    webpackDevServer.addDevServerEntrypoints(config, options);
    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, options);

    server.listen(port, '', () => {
      console.log(`dev server listening on port ${port}`);
      openWindow();
    });
  } else {
    openWindow();
  }
})();

function createWindow() {
  win = new BrowserWindow({
    height: 720 + (IS_PROD ? 0 : 400),
    webPreferences: {
      enableRemoteModule: false,
      nodeIntegration: true,
    },
    width: 1280,
  });

  IS_PROD
    ? win
      .loadFile(join(__dirname, 'public', 'index.html'))
      .catch(console.log)
    : win
      .loadURL(`http://127.0.0.1:${port}/index.html`)
      .catch(console.log);

  IS_PROD || win.webContents.openDevTools();

  win.on('closed', () => {
    app.quit();
  });
}

app.on('ready', openWindow);

app.on('window-all-closed', () => {
  app.quit();
});

'use strict';

const { app, BrowserWindow } = require('electron');
const { join } = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 1280,
  });

  win.loadFile(join(__dirname, 'public/index.html'));

  win.webContents.openDevTools();

  win.on('closed', () => {
    app.quit();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

import { readAsync as read, writeAsync as write } from 'fs-jetpack';
import * as getIncrementalPort from 'get-incremental-port';
import { createServer } from 'http';
import * as lowdb from 'lowdb';
import { AdapterAsync } from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { join } from 'path';
import * as socketIO from 'socket.io';
import {
  CONNECT,
  GET_CHROMECASTS,
  GET_MEDIA_STATUS,
  GET_STATUS,
  LAUNCH,
  LAUNCH_APP,
  PAUSE,
  PLAY,
  SEEK,
  SET_MUTED,
  SET_VOLUME,
  STOP_MEDIA,
  UPDATE_HISTORY,
} from '../constants';
import { DbSchema } from '../types';
import { setChromecasts } from './action-creators';
import ChromecastEmitter from './ChromecastEmitter';
import { FilesRouter } from './FilesRouter';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
let retries = 2;

const START_PORT = 3000;

export let db;
export let port;

(function serverRestarter() {
  startServer()
    .catch(err => {
      console.log(err);
      retries--;
      if (retries > 0) serverRestarter();
    });
})();

async function startServer() {
  port = await getIncrementalPort(START_PORT);
  await writePortToIndex(port);

  const adapter: AdapterAsync<DbSchema> = new FileAsync(join(__dirname, '..', 'db.json'));
  db = await lowdb(adapter);

  await db
    .defaults({
      history: {},
      imageCache: {},
    })
    .write();

  const app = express();
  const chromecastEmitter = new ChromecastEmitter();
  const server = createServer(app);
  const io = socketIO(server, {
    origins: '*:*',
  });

  io.on('connection', socket => {
    console.log('client connected');
    const dispatch = action => socket.emit('dispatch', action);

    chromecastEmitter.setDispatch(dispatch);

    socket.on('dispatch', async ({ type, payload }) => {
      if (![GET_MEDIA_STATUS, UPDATE_HISTORY].includes(type)) {
        console.log(type);
        payload && console.log(payload);
      }

      switch (type) {
        // player
        case CONNECT:
          chromecastEmitter.connect(payload);
          return;
        case GET_CHROMECASTS:
          dispatch(setChromecasts(await ChromecastEmitter.GetChromecasts()));
          return;
        case GET_MEDIA_STATUS:
          chromecastEmitter.getMediaStatus();
          return;
        case GET_STATUS:
          chromecastEmitter.getStatus();
          return;
        case LAUNCH:
          chromecastEmitter.launch(payload.path, payload.isUrl).catch(console.log);
          return;
        case LAUNCH_APP:
          chromecastEmitter.launchApp(payload);
          return;
        case PAUSE:
          chromecastEmitter.pause();
          return;
        case PLAY:
          chromecastEmitter.play();
          return;
        case SEEK:
          chromecastEmitter.seek(payload);
          return;
        case SET_MUTED:
          chromecastEmitter.setMuted(payload);
          return;
        case SET_VOLUME:
          chromecastEmitter.setVolume(payload);
          return;
        case STOP_MEDIA:
          chromecastEmitter.stop();
          return;
        case UPDATE_HISTORY:
          const { currentTime, title } = payload;
          await db.set(['history', title], currentTime).write();
          return;
      }
    });
  });

  app.use(bodyParser.json());
  app.use(cors());

  app.use('/api/files', FilesRouter);

  server.listen(port, () => console.log(`server running on port ${port}`));
}

async function writePortToIndex(port: number) {
  const index = await read(join(__dirname, '../client/index.html'));
  await write(
    join(__dirname, '../public/index.html'),
    index.replace('PORT__ = 0', `PORT__ = ${port}`),
  );
}

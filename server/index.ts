import { readAsync as read, writeAsync as write } from 'fs-jetpack';
import * as getIncrementalPort from 'get-incremental-port';
import { createServer } from 'http';
import { join } from 'path';
import * as socketIO from 'socket.io';
import {
  CONNECT,
  GET_CHROMECASTS,
  GET_DRIVES_SERVER,
  GET_FILE_ITEMS,
  GET_FILES_SERVER,
  GET_MEDIA_STATUS,
  GET_STATUS,
  INSPECT_FILE_SERVER,
  LAUNCH,
  LAUNCH_APP,
  PAUSE,
  PLAY,
  SEEK,
  SET_MUTED,
  SET_VOLUME,
  STOP_MEDIA,
} from '../constants';
import {
  getDrivesAction,
  getFilesAction,
  inspectFileAction,
  setChromecasts,
  setFileItemsAction,
} from './action-creators';
import ChromecastEmitter from './ChromecastEmitter';
import { FilesRouter, getDrives, getFileItems, getFiles, inspectFile } from './FileUtils';

const START_PORT = 3000;
export let port;

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
let retries = 10;

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
      if (type !== GET_MEDIA_STATUS) console.log(type);
      payload && console.log(payload);

      switch (type) {
        // files
        case GET_DRIVES_SERVER:
          dispatch(getDrivesAction(await getDrives()));
          return;
        case GET_FILE_ITEMS: {
          dispatch(setFileItemsAction(await getFileItems(payload), payload));
          return;
        }
        case GET_FILES_SERVER: {
          const path = (join(...payload) + '/').replace(':.', ':');
          dispatch(getFilesAction(await getFiles(path), payload));
          return;
        }
        case INSPECT_FILE_SERVER:
          dispatch(inspectFileAction(await inspectFile(payload), payload));
          return;

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
    index.replace('PORT__ = 0', `PORT__ = ${port}`)
  );
}

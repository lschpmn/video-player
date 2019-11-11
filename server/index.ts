import { createServer } from 'http';
import { join } from 'path';
import * as socketIO from 'socket.io';
import {
  CONNECT,
  GET_CHROMECASTS,
  GET_DRIVES_SERVER,
  GET_FILES_SERVER,
  GET_MEDIA_STATUS,
  GET_STATUS,
  INSPECT_FILE_SERVER,
  LAUNCH,
  PAUSE,
  PLAY,
  PORT,
  SEEK,
  STOP_MEDIA,
} from '../constants';
import { getDrivesAction, getFilesAction, inspectFileAction, setChromecasts } from './action-creators';
import ChromecastEmitter from './ChromecastEmitter';
import { FilesRouter, getDrives, getFiles, inspectFile } from './FileUtils';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

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
    console.log(type);
    payload && console.log(payload);

    switch (type) {
      // files
      case GET_DRIVES_SERVER:
        dispatch(getDrivesAction(await getDrives()));
        return;
      case GET_FILES_SERVER:
        const path = (join(...payload) + '/').replace(':.', ':');
        dispatch(getFilesAction(await getFiles(path), payload));
        return;
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
        chromecastEmitter.launch(payload);
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
      case STOP_MEDIA:
        chromecastEmitter.stop();
        return;
    }
  });
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/files', FilesRouter);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

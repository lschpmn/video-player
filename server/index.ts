import { createServer } from 'http';
import { join } from 'path';
import * as socketIO from 'socket.io';
import {
  CONNECT,
  GET_CHROMECASTS,
  GET_DRIVES_SERVER,
  GET_FILES_SERVER,
  INSPECT_FILE_SERVER,
  PORT,
} from '../constants';
import { getDrivesAction, getFilesAction, inspectFileAction, setChromecasts } from './action-creators';
import ChromecastEmitter from './ChromecastEmitter';
import { FilesRouter, getDrives, getFiles, inspectFile } from './FileUtils';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const server = createServer(app);
const io = socketIO(server, {
  origins: '*:*',
});

io.on('connection', socket => {
  console.log('client connected');
  let chromecastEmitter: ChromecastEmitter;

  socket.on('dispatch', async ({ type, payload }) => {
    console.log(type);
    console.log(payload);
    const dispatch = action => socket.emit('dispatch', action);

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
        chromecastEmitter = new ChromecastEmitter(payload, dispatch);
        return;
      case GET_CHROMECASTS:
        dispatch(setChromecasts(await ChromecastEmitter.GetChromecasts()));
        return;
    }
  });

  socket.on('disconnect', () => {
    chromecastEmitter?.destroy();
  });
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/files', FilesRouter);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

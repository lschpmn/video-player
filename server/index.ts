import { createServer } from 'http';
import { join } from 'path';
import * as socketIO from 'socket.io';
import { GET_DRIVES_SERVER, GET_FILES_SERVER, INSPECT_FILE_SERVER, PORT } from '../constants';
import { getDrivesAction, getFilesAction, inspectFileAction } from './action-creators';
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

  socket.on('dispatch', async ({ type, payload }) => {
    console.log(type);
    console.log(payload);
    const dispatch = action => socket.emit('dispatch', action);

    switch (type) {
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
    }

  });
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/files', FilesRouter);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

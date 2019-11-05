import * as socketIO from 'socket.io';
import { createServer } from 'http';
import ChromecastRouter from './ChromecastRouter';
import FilesRouter from './FilesRouter';
import { PORT } from '../constants';
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

  socket.on('dispatch', ({ type, payload }) => {
    console.log(type);
    console.log(payload);
  });
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/cast', ChromecastRouter);
app.use('/api/files', FilesRouter);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

import { createServer } from 'http';
import * as socketIO from 'socket.io';
import { PORT } from '../constants';
import FilesRouter from './FilesRouter';

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

app.use('/api/files', FilesRouter);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

import { readAsync as read, writeAsync as write } from 'fs-jetpack';
import * as getIncrementalPort from 'get-incremental-port';
import { createServer } from 'http';
import * as lowdb from 'lowdb';
import { AdapterAsync, LowdbAsync } from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { join } from 'path';
import * as socketIO from 'socket.io';
import { GET_MEDIA_STATUS, UPDATE_HISTORY } from '../constants';
import { DbSchema } from '../types';
import { dbUpdate } from './action-creators';
import { chromecastReducer } from './chromecast';
import ChromecastEmitter from './chromecast/ChromecastEmitter';
import { filesReducer, filesRequest } from './files';

const express = require('express');
let retries = 2;

const START_PORT = 3000;

export let chromecastEmitter: ChromecastEmitter;
export let db: LowdbAsync<DbSchema>;
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

  chromecastEmitter = new ChromecastEmitter();

  const app = express();
  const server = createServer(app);
  const io = socketIO(server, {
    origins: '*:*',
  });

  io.on('connection', socket => {
    console.log('client connected');
    const dispatch = action => socket.emit('dispatch', action);
    dispatch(dbUpdate(db.value()));

    chromecastEmitter.setDispatch(dispatch);

    socket.on('dispatch', ({ type, payload }) => {
      if (![GET_MEDIA_STATUS, UPDATE_HISTORY].includes(type)) {
        console.log(type);
        payload && console.log(payload);
      }

      chromecastReducer(type, payload, dispatch)
        .catch(console.log);

      filesReducer(type, payload, dispatch)
        .catch(console.log);
    });

    socket.on('message', (type, data, res) => {
      filesRequest(type, data, res)
        .catch(console.log);
    });
  });

  server.listen(port, () => console.log(`server running on port ${port}`));
}

async function writePortToIndex(port: number) {
  const index = await read(join(__dirname, '../client/index.html'));
  await write(
    join(__dirname, '../public/index.html'),
    index.replace('PORT__ = 0', `PORT__ = ${port}`),
  );
}

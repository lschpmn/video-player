import ChromecastRouter from './ChromecastRouter';
import FilesRouter from './FilesRouter';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/cast', ChromecastRouter);
app.use('/api/files', FilesRouter);

app.listen(3000, () => console.log('server running on port 3000'));

const WebSocketClient = require('websocket').client;

const client = new WebSocketClient();

client.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });
});

console.log('trying to connect');
client.connect('ws://192.168.1.107:8009/');
'use strict';

const bodyParser = require('body-parser');
const chromecasts = require('chromecasts');
const cors = require('cors');
const express = require('express');
const os = require('os');

const app = express();
const files = {};
const ipAddress = os.networkInterfaces()['Wi-Fi'].find(net => net.family === 'IPv4').address;
const list = chromecasts();
let player;

console.log(ipAddress);

app.use(bodyParser.json());
app.use(cors());

list.on('update', _player => {
  console.log(`Found player: ${_player.name}`);
  player = _player;

  _player.on('status', console.log);
});

app.post('/api/play', (req, res) => {
  console.log(req.body);
  const { filePath } = req.body;
  const path = addFile(filePath);
  res.end(path);

  player.play(path, console.log);
});

app.post('/api/pause', (req, res) => {
  player.pause(err => {
    console.log(err);

    res.end(err || 'success');
  });
});

app.post('/api/resume', (req, res) => {
  player.resume(err => {
    console.log(err);

    res.end(err || 'success');
  });
});

app.post('/api/status', (req, res) => {
  player.status(status => {
    res.end(JSON.stringify(status, null, 2));
  });
});

app.listen(3001, () => console.log('Server started on port 3001'));

function addFile(filePath) {
  if (!files[filePath]) {
    const tmpName = Math.random().toString(36).slice(2);

    app.use(`/api/${tmpName}.mp4`, express.static(filePath, {
      setHeaders: (res, path, stat) => {
        res.type('video/mp4');
        console.log('Headers set');
      }
    }));
    
    console.log(`Adding ${filePath} to static server`);

    files[filePath] = `http://${ipAddress}:3001/api/${tmpName}.mp4`;
    console.log(`url: ${files[filePath]}`);
  }
  
  return files[filePath];
}
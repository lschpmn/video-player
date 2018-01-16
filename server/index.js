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
let status;

console.log(ipAddress);

app.use(bodyParser.json());
app.use(cors());

list.on('update', _player => {
  console.log(`Found player: ${_player.name}`);
  player = _player;

  _player.on('status', _status => {
    status = _status;
    console.log(status);
  });
});

app.post('/api/play', (req, res) => {
  console.log(req.body);
  list.update();
  const { filePath } = req.body;
  const path = addFile(filePath);

  player.play(path, (err, status) => {
    if (err) return res.status(500).send(err);

    res.send(status);
  });
});

app.post('/api/pause', (req, res) => {
  player.pause(err => {
    if (err) {
      console.log(err);
      res.status(500).end(err);
    }

    console.log('Paused');
    res.send(status);
  });
});

app.post('/api/resume', (req, res) => {
  player.resume(err => {
    if (err) {
      console.log(err);
    }
  });

  console.log('Resume');
  res.end();
});

app.get('/api/status', (req, res) => {
  player.status(status => {
    console.log(status);
    res.send(JSON.stringify(status, null, 2));
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));

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

    files[filePath] = `http://${ipAddress}:3000/api/${tmpName}.mp4`;
    console.log(`url: ${files[filePath]}`);
  }
  
  return files[filePath];
}
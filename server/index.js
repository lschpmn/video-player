'use strict';

const bodyParser = require('body-parser');
const chromecasts = require('chromecasts');
const cors = require('cors');
const express = require('express');
const os = require('os');

const app = express();
const files = {};
const ipAddress = os.networkInterfaces()['Wi-Fi'].find(net => net.family === 'IPv4').address;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/play-media', (req, res) => {
  console.log(req.body);
  const { filePath } = req.body;
  addFile(filePath);
  res.end();
  
  const list = chromecasts();
  list.on('update', player => {
    const path = `http://${ipAddress}:3001/api/${files[filePath]}.mp4`;
    console.log(`Playing on ${path}`);
    
    player.play(path, console.log);
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
    
    files[filePath] = tmpName;
  }
}
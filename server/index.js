'use strict';

const bodyParser = require('body-parser');
const chromecasts = require('chromecasts');
const cors = require('cors');
const express = require('express');

const app = express();
const files = {};

app.use(bodyParser.json());
app.use(cors());

app.post('/api/play-media', (req, res) => {
  console.log(req.body);
  const { filePath } = req.body;
  addFile(filePath);
  res.end();
  
  var list = chromecasts();
  list.on('update', player => {
    const path = `http://localhost:3001/api/file.mp4`;
    console.log(`Playing on ${path}`);
    
    player.play(path, console.log);
  });
});

function addFile(filePath) {
  if (!files[filePath]) {
    
    app.use(`/api/file.mp4`, express.static(filePath, {
      setHeaders: (res, path, stat) => {
        res.type('video/mp4');
        console.log('Headers set');
      }
    }));
    
    console.log(`Adding ${filePath} to static server`);
    
    files[filePath] = true;
  }
}

app.listen(3001, () => console.log('Server started on port 3001'));
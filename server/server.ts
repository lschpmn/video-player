import {  } from 'fs-jetpack';

const express = require('express');

const app = express();

app.get('/api/file:path', (req, res) => {

});

app.listen(3001, () => console.log('server running on port 3000'));
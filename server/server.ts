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
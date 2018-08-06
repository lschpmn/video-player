import FilesRouter from './FilesRouter';

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use('/api/files', FilesRouter);

app.listen(3001, () => console.log('server running on port 3000'));
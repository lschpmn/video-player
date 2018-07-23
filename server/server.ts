import {  } from 'fs-jetpack';
import { Request, Response } from 'express';

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());

app.get('/api/file/:path', (req: Request, res: Response) => {
  console.log(req);

  res.send('fuck yeah');
});

app.listen(3001, () => console.log('server running on port 3000'));
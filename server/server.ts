import { listAsync as list } from 'fs-jetpack';
import { Request, Response } from 'express';

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());

app.get('/api/files/list/:path', async (req: Request, res: Response) => {
  const path = decodeURIComponent(req.params.path);
  const files = await list(path);

  console.log('files');
  console.log(files);
  res.send(files);
});

app.listen(3001, () => console.log('server running on port 3000'));
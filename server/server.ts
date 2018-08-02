import { exec } from 'child_process';
import { inspectAsync as inspect, listAsync as list } from 'fs-jetpack';
import { NextFunction, Request, Response } from 'express';

const cors = require('cors');
const express = require('express');

const PREFIX = '/api/files';
const app = express();

app.use(cors());

app.get(PREFIX + '/get-drives', (req: Request, res: Response) => {
  exec(' wmic logicaldisk get caption', (err, stdout) => {
    if (err) res.status(500).send(err);

    const drives = stdout.match(/\w:/g);
    console.log(drives);
    res.send(drives);
  });
});

app.get(PREFIX + '/list/:path', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = decodeURIComponent(req.params.path);
    const files = await list(path);

    console.log(`files for path ${path}`);
    console.log(files);
    res.send(files);
  } catch (err) {
    next(err);
  }
});

app.get(`${PREFIX}/inspect/:path`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = decodeURIComponent(req.params.path);
    const file = await inspect(path);

    res.send(file);
  } catch (err) {
    next(err);
  }
});

app.listen(3001, () => console.log('server running on port 3000'));
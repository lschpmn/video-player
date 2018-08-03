import { exec } from 'child_process';
import { inspectAsync as inspect, listAsync as list } from 'fs-jetpack';
import { NextFunction, Request, Response, Router } from 'express';

const cors = require('cors');
const express = require('express');

const app = express();
const filesRouter = Router();

app.use(cors());
app.use('/api/files', filesRouter);

filesRouter.get('/get-drives', (req: Request, res: Response) => {
  exec(' wmic logicaldisk get caption', (err, stdout) => {
    if (err) return res.status(500).send(err);

    const drives = stdout.match(/\w:/g);
    console.log(drives);
    res.send(drives);
  });
});

filesRouter.get('/list/:path', async (req: Request, res: Response, next: NextFunction) => {
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

filesRouter.get('/inspect/:path', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = decodeURIComponent(req.params.path);
    const file = await inspect(path);

    res.send(file);
  } catch (err) {
    next(err);
  }
});

app.listen(3001, () => console.log('server running on port 3000'));
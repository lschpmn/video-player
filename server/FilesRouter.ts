import { exec } from 'child_process';
import { Request, Response, Router, static as expressStatic } from 'express';
import { address } from 'ip';
import { inspectAsync as inspect, listAsync as list } from 'fs-jetpack';
import { errorHandler } from './utils';
import { PORT } from '../constants';

const ipAddress = address();
const filesRouter = Router();
const fileUrlMap: { [s: string]: string } = {};

filesRouter.get('/get-drives', (req: Request, res: Response) => {
  exec(' wmic logicaldisk get caption', (err, stdout) => {
    if (err) return res.status(500).send(err);

    const drives = stdout.match(/\w:/g);
    console.log(drives);
    res.send(drives);
  });
});

filesRouter.get('/get-file-url/:path', errorHandler(async (req: Request, res: Response) => {
  const path = decodeURIComponent(req.params.path);

  if (fileUrlMap[path]) return res.send(fileUrlMap[path]);

  const tmpName = Math.random().toString(36).slice(-2);

  filesRouter.use(`/${tmpName}.mp4`, expressStatic(path, {
    setHeaders: res => res.type('video/mp4'),
  }));

  fileUrlMap[path] = `http://${ipAddress}:${PORT}/api/files/${tmpName}.mp4`;
  console.log(`url: ${fileUrlMap[path]}`);
  res.send(fileUrlMap[path]);
}));

filesRouter.get('/list/:path', errorHandler(async (req: Request, res: Response) => {
  const path = decodeURIComponent(req.params.path);
  const files = await list(path);

  console.log(`files for path ${path}`);
  console.log(files);
  res.send(files);
}));

filesRouter.get('/inspect/:path', errorHandler(async (req: Request, res: Response) => {
  const path = decodeURIComponent(req.params.path);
  const file = await inspect(path);

  console.log(`for ${path}`);
  console.log(file);

  res.send(file);
}));

export default filesRouter;
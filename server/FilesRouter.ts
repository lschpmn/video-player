import { Request, Response, Router } from 'express';
import { exec } from 'child_process';
import { inspectAsync as inspect, listAsync as list } from 'fs-jetpack';

const filesRouter = Router();

filesRouter.get('/get-drives', (req: Request, res: Response) => {
  exec(' wmic logicaldisk get caption', (err, stdout) => {
    if (err) return res.status(500).send(err);

    const drives = stdout.match(/\w:/g);
    console.log(drives);
    res.send(drives);
  });
});

filesRouter.get('/get-file-url/:path', errorHandler((req: Request, res: Response) => {

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

function errorHandler(handler) {
  return (req, res, next) => {
    handler(req, res)
      .catch(err => next(err));
  }
}

export default filesRouter;
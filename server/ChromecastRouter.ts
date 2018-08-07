import { Request, Response, Router } from 'express';
import ChromecastController from './ChromecastController';
import { errorHandler } from './utils';

const chromecastController = new ChromecastController();
const chromecastRouter = Router();

chromecastRouter.post('/start', errorHandler((req: Request, res: Response) => {
  console.log(req.body);
  const addr = chromecastController.addresses;
  console.log(addr);
  res.send(addr || 'wtf?');
}));

export default chromecastRouter;
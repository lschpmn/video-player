import { Request, Response, Router } from 'express';
import ChromecastController from './ChromecastController';
import { errorHandler } from './utils';

const chromecastController = new ChromecastController();
const chromecastRouter = Router();

chromecastRouter.post('/play', errorHandler((req: Request, res: Response) => {
  console.log(req.body);
  res.send(chromecastController.addresses);
}));

export default chromecastRouter;
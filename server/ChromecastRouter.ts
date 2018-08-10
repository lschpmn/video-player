import { Request, Response, Router } from 'express';
import ChromecastController from './ChromecastController';
import { errorHandler } from './utils';
import { CommandStart } from '../client/types';

const chromecastController = new ChromecastController();
const chromecastRouter = Router();

chromecastRouter.post('/start', errorHandler(async (req: Request, res: Response) => {
  const { address, url } = req.body as CommandStart;

  console.log(`Got start command`);
  const status = await chromecastController.start(url, address);
  console.log(status);
  res.send(status);

  // const response = chromecastController.start(address, url);

  // res.send('please wait');
}));

export default chromecastRouter;
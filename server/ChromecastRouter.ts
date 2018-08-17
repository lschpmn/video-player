import { Request, Response, Router } from 'express';
import ChromecastController from './ChromecastController';
import { errorHandler } from './utils';
import { CommandStart } from '../client/types';

const chromecastScanner = require('chromecast-scanner');
const chromecastController = new ChromecastController();
const chromecastRouter = Router();

chromecastRouter.post('/start', errorHandler(async (req: Request, res: Response) => {
  const { address, url } = req.body as CommandStart;

  console.log(`Got start command`);
  const actualAddress = await getAddress();
  console.log(actualAddress);

  const status = await chromecastController.start(url, actualAddress);
  console.log(status);
  res.send(status);

  // const response = chromecastController.start(address, url);

  // res.send('please wait');
}));

chromecastRouter.post('/status', errorHandler(async (req: Request, res: Response) => {
  const status = await chromecastController.getStatus(req.body.address);

  console.log('Chromecast status');
  console.log(status);
  res.send(status);
}));

export default chromecastRouter;

async function getAddress(): Promise<string> {
  return new Promise((resolve, reject) => {
    chromecastScanner((err, service) => {
      if (err) return reject(err);

      resolve(service.data);
    });
  }) as Promise<string>;
}
import { NextFunction, Request, Response, Router } from 'express';
import ChromecastController from './ChromecastController';

const chromecastController = new ChromecastController();
const chromecastRouter = Router();

chromecastRouter.post('play', (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    next(err);
  }
});

export default chromecastRouter;
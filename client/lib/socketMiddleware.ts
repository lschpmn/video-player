import * as io from 'socket.io-client';
import { PORT } from '../../constants';

const socket = io(`http://localhost:${PORT}`);

export default store => next => action => {
  console.log(action.type);
  if (action.type.includes('@server')) socket.emit('dispatch', action);

  return next(action);
};

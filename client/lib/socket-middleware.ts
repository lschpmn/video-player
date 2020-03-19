import { getSocket } from './socket';

export default store => {
  const socket = getSocket();

  socket.on('dispatch', action => store.dispatch(action));

  return next => action => {
    if (action.type.includes('@server')) socket.emit('dispatch', action);

    return next(action);
  };
};

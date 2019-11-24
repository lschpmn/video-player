import * as io from 'socket.io-client';

export default store => {
  // @ts-ignore
  const socket = io(`http://localhost:${window.__PORT__}`);

  socket.on('dispatch', action => store.dispatch(action));

  return next => action => {
    if (action.type.includes('@server')) socket.emit('dispatch', action);

    return next(action);
  };
};

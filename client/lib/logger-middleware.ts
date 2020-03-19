import isEqual from 'lodash/isEqual';

export default store => {
  let lastStore = store.getState();
  return next => action => {
    console.log(action);
    const result = next(action);
    const nextStore = store.getState();
    if (!isEqual(lastStore, nextStore)) console.log(store.getState());
    lastStore = nextStore;
    return result;
  }
};

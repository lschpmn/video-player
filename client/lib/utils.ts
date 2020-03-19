import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function getTimeString(time) {
  if (!time) return '0:00';
  let currentTime = Math.round(time);
  let hour;
  let min;
  let sec;

  sec = currentTime % 60;
  currentTime -= sec;

  min = (currentTime % 3600) / 60;
  currentTime -= min * 60;

  hour = Math.round(currentTime / 3600);

  return `${hour ? hour + ':' : ''}${leadZero(min)}:${leadZero(sec)}`;
}

export function leadZero(num) {
  return ('0' + num).slice(-2);
}

export const useAction = <T extends Function>(action: T, deps=[]): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), [dispatch, ...deps]) as any;
};

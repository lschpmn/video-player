import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FileItem, FileStructure } from '../types';

export function getFileItem(fileStructure: FileStructure, location: string[]): FileItem {
  if (location.length === 0) return null;
  if (location.length === 1) {
    return fileStructure[location[0]];
  } else {
    return getFileItem(fileStructure[location[0]].files, location.slice(1));
  }
}

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

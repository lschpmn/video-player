import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const PORT = window.__PORT__;

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

export function post(url: string, body: object) {
  const opts: RequestInit = {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };

  return fetch(url, opts)
    .then(async res => await res.json());
}

export function postLocal(url: string, body: object) {
  return post(`http://localhost:${PORT}${url}`, body);
}

export async function requestDrives() {
  const response = await fetch(`http://localhost:${PORT}/api/files/get-drives`);
  return await response.json();
}

export async function requestFileItems(path) {
  const response = await fetch(`http://localhost:${PORT}/api/files/get-files`, {
    body: JSON.stringify({ path }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return await response.json();
}

export const useAction = <T extends Function>(action: T, deps=[]): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), [dispatch, ...deps]) as any;
};

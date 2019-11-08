import { exec } from 'child_process';
import { Router, static as expressStatic } from 'express';
import { inspectAsync, listAsync } from 'fs-jetpack';
import { networkInterfaces } from 'os';
import { PORT } from '../constants';

export const FilesRouter = Router();

const ipAddress = networkInterfaces().Ethernet
  ? networkInterfaces().Ethernet.find(e => e.family === 'IPv4').address
  : networkInterfaces()['Wi-Fi'].find(e => e.family === 'IPv4').address;
const fileUrlMap: { [s: string]: string } = {};

export function getDrives() {
  return new Promise((resolve, reject) => {
    exec(' wmic logicaldisk get caption', (err, stdout) => {
      if (err) return reject(err);

      const drives = stdout.match(/\w:/g);
      console.log(drives);
      resolve(drives);
    });
  });
}

export async function getFiles(location: string) {
  const files = await listAsync(location);

  console.log(`files for path ${location}`);
  console.log(files);
  return files;
}

export async function getFileUrl(path: string) {
  if (fileUrlMap[path]) return fileUrlMap[path];

  const tmpName = Math.random().toString(36).slice(-2);

  FilesRouter.use(`/${tmpName}.mp4`, expressStatic(path, {
    setHeaders: res => res.type('video/mp4'),
  }));

  fileUrlMap[path] = `http://${ipAddress}:${PORT}/api/files/${tmpName}.mp4`;
  console.log(`url: ${fileUrlMap[path]}`);
  return fileUrlMap[path];
}

export async function inspectFile(path: string) {
  try {
    const file = await inspectAsync(path);

    console.log(`for ${path}`);
    console.log(file);

    return file;
  } catch (err) {
    return {
      type: 'forbidden',
    };
  }
}

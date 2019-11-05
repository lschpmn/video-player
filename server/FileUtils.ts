import { exec } from 'child_process';
import { Router, static as expressStatic } from 'express';
import { inspectAsync, listAsync } from 'fs-jetpack';
import { address } from 'ip';
import { PORT } from '../constants';

const ipAddress = address();
const filesRouter = Router();
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

export async function getFileUrl(path: string) {

  if (fileUrlMap[path]) return fileUrlMap[path];

  const tmpName = Math.random().toString(36).slice(-2);

  filesRouter.use(`/${tmpName}.mp4`, expressStatic(path, {
    setHeaders: res => res.type('video/mp4'),
  }));

  fileUrlMap[path] = `http://${ipAddress}:${PORT}/api/files/${tmpName}.mp4`;
  console.log(`url: ${fileUrlMap[path]}`);
  return fileUrlMap[path]
}

export async function list(path: string) {
  const files = await listAsync(path);

  console.log(`files for path ${path}`);
  console.log(files);
  return files;
}

export async function inspect(path: string) {
  const file = await inspectAsync(path);

  console.log(`for ${path}`);
  console.log(file);

  return file;
}

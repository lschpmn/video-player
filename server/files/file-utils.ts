import { exec } from 'child_process';
import { static as expressStatic } from 'express';
import { inspectAsync, listAsync } from 'fs-jetpack';
import { networkInterfaces } from 'os';
import { FileItem } from '../../client/types';
import { FilesRouter } from '../FilesRouter';
import { port } from '../index';
import { join } from 'path';

export const ipAddress = networkInterfaces().Ethernet
  ? networkInterfaces().Ethernet.find(e => e.family === 'IPv4').address
  : networkInterfaces()['Wi-Fi'].find(e => e.family === 'IPv4').address;
const fileUrlMap: { [s: string]: string } = {};

export function getDrives(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec(' wmic logicaldisk get caption', (err, stdout) => {
      if (err) return reject(err);

      const drives = stdout.match(/\w:/g);
      console.log(drives);
      resolve(drives);
    });
  });
}

export async function getFileItems(path: string): Promise<FileItem[]> {
  const files = await listAsync(path);
  const fileInspectPromises = files.map(async file => {
    const filePath = join(path, file);
    try {
      const inspect = await inspectAsync(filePath);
      return {
        ...inspect,
        path: filePath,
      };
    } catch (err) {
      return null;
    }
  });

  return (await Promise.all(fileInspectPromises))
    .filter(a => !!a)
    .sort((aItem, bItem) => {
      if (aItem.type === 'dir' && bItem.type === 'dir') {
        return aItem.path.localeCompare(bItem.path);
      } else if (aItem.type === 'dir' && bItem.type !== 'dir') {
        return -1;
      } else if (aItem.type !== 'dir' && bItem.type === 'dir') {
        return 1;
      }

      return aItem.path.localeCompare(bItem.path);
    });
}

export async function getFileUrl(path: string) {
  if (fileUrlMap[path]) return fileUrlMap[path];

  const tmpName = Math.random().toString(36).slice(-2);

  FilesRouter.use(`/${tmpName}.mp4`, expressStatic(path, {
    setHeaders: res => res.type('video/mp4'),
  }));

  fileUrlMap[path] = `http://${ipAddress}:${port}/api/files/${tmpName}.mp4`;
  console.log(`url: ${fileUrlMap[path]}`);
  return fileUrlMap[path];
}

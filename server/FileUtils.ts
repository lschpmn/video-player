import { exec } from 'child_process';
import { Router, static as expressStatic } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import { dirAsync, inspectAsync, listAsync } from 'fs-jetpack';
import { networkInterfaces } from 'os';
import { join } from 'path';
import { FileItem } from '../client/types';
import { port } from './index';

const imageCache = {};

export const FilesRouter = Router();

export const ipAddress = networkInterfaces().Ethernet
  ? networkInterfaces().Ethernet.find(e => e.family === 'IPv4').address
  : networkInterfaces()['Wi-Fi'].find(e => e.family === 'IPv4').address;
const fileUrlMap: { [s: string]: string } = {};

FilesRouter.get('/get-drives', async (req, res) => {
  const drives = await getDrives();
  res.send(drives.map(drive => ({ path: drive, type: 'dir' })));
});

FilesRouter.post('/get-files', async (req, res) => {
  const path = req.body.path;
  const files = await getFileItems(path);
  files
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
  res.send(files);
});

FilesRouter.post('/get-thumbnail', async (req, res) => {
  const path = req.body.path;
  if (imageCache[path]) {
    res.send({ path: imageCache[path] });
    return;
  }

  const id = Math.random().toString(36).slice(-8);
  const imagePath = join(__dirname, '..', 'public', 'images', id);
  await dirAsync(imagePath);

  ffmpeg(path)
    .on('error', (err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    })
    .on('end', () => {
      imageCache[path] = `/images/${id}/1.png`;

      res.send({ path: imageCache[path] });
    })
    .screenshots({
      filename: '1.png',
      folder: imagePath,
      size: '360x?',
      timemarks: ['10%'],
    });
});

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
  return await Promise.all(files.map(async file => {
    const filePath = path + file;
    try {
      const inspect = await inspectAsync(filePath);
      return {
        ...inspect,
        path: filePath,
      };
    } catch (err) {
      return { path: filePath, type: 'forbidden' as 'forbidden' };
    }
  }));
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

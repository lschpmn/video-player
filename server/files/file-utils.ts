import { exec } from 'child_process';
import { Router, static as expressStatic } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import { dirAsync, inspectAsync, listAsync } from 'fs-jetpack';
import { networkInterfaces } from 'os';
import { join } from 'path';
import { db as DB, port } from '..';
import { FileItem } from '../../types';

const FilesRouter = Router();

export const ipAddress = networkInterfaces().Ethernet
  ? networkInterfaces().Ethernet.find(e => e.family === 'IPv4').address
  : networkInterfaces()['Wi-Fi'].find(e => e.family === 'IPv4').address;
const fileUrlMap: { [s: string]: string } = {};

export function getDrives(): Promise<FileItem[]> {
  return new Promise((resolve, reject) => {
    exec(' wmic logicaldisk get caption', (err, stdout) => {
      if (err) return reject(err);

      const drives = stdout.match(/\w:/g)
        .map(drive => ({
          path: `${drive}\\`,
          type: 'dir',
        } as FileItem));
      console.log(drives);
      resolve(drives);
    });
  });
}

export async function getFileItems(path: string): Promise<FileItem[]> {
  const db = DB.value();
  const files = await listAsync(path);
  const fileInspectPromises = files.map(async file => {
    const filePath = `${path}\\${file}`;
    console.log('filePath');
    console.log(filePath);
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
    })
    .map((file: FileItem) => {
      if (db.imageCache[file.path]) {
        file.images = [db.imageCache[file.path]];
      }

      return file;
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

export async function getThumbnail(path: string): Promise<string> {
  const db = DB.value();

  if (db.imageCache[path]) return db.imageCache[path];

  const id = Math.random().toString(36).slice(-8);
  const imagePath = join(__dirname, '..', '..', 'public', 'images', id);
  await dirAsync(imagePath);

  return new Promise((resolve, reject) => {
    ffmpeg(path)
      .on('error', err => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        db.imageCache[path] = `/images/${id}/1.png`;
        await DB.write();
        resolve(db.imageCache[path]);
      })
      .screenshots({
        filename: '1.png',
        folder: imagePath,
        size: '360x?',
        timemarks: ['10%'],
      });
  });


}

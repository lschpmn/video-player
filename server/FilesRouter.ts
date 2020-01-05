import { Router } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import { dirAsync } from 'fs-jetpack';
import { join } from 'path';
import { getDrives, getFileItems } from './FileUtils';
import { db } from './index';

export const FilesRouter = Router();

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

  if (db.has(['imageCache', path]).value()) {
    res.send({ path: db.get(['imageCache', path]).value() });
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
    .on('end', async () => {
      const imagePath = `/images/${id}/1.png`;
      await db.set(['imageCache', path], imagePath).write();
      res.send({ path: imagePath });
    })
    .screenshots({
      filename: '1.png',
      folder: imagePath,
      size: '360x?',
      timemarks: ['10%'],
    });
});

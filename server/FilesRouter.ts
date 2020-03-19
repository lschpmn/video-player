import { Router } from 'express';
import { getDrives, getFileItems } from './FileUtils';

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

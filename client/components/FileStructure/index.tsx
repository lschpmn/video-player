import * as React from 'react';
import { useEffect, useState } from 'react';
import { FileItem } from '../../../types';
import { setCurrentLocation } from '../../lib/file-actions';
import { getDrives } from '../../lib/socket';
import { useAction } from '../../lib/utils';
import DirectoryItem from './DirectoryItem';

const FileStructure = () => {
  const [drives, setDrives] = useState([] as FileItem[]);
  const setCurrentLocationAction = useAction(setCurrentLocation);

  useEffect(() => {
    getDrives()
      .then(res => {
        setDrives(res);
      })
      .catch(console.log);
  }, []);

  return <div style={styles.container}>
    {drives
      .map(drive =>
        <DirectoryItem
          fileItem={drive}
          key={drive.path}
          setCurrentLocation={setCurrentLocationAction}
        />
      )
    }
  </div>;
};

const styles = {
  container: {
    margin: '0 0.5rem',
  },
};

export default FileStructure;

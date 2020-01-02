import * as React from 'react';
import { useEffect, useState } from 'react';
import { setCurrentLocation } from '../../lib/file-actions';
import { requestDrives, useAction } from '../../lib/utils';
import { FileStructure as FileStructureType } from '../../types';
import DirectoryItem from './DirectoryItem';

const FileStructure = () => {
  const [drives, setDrives] = useState(null as FileStructureType | null);
  const setCurrentLocationAction = useAction(setCurrentLocation);

  useEffect(() => {
    requestDrives()
      .then(res => setDrives(res))
      .catch(console.log);
  }, []);

  return <div style={styles.container}>
    {drives && Object.keys(drives)
      .map((drive: string) =>
        <DirectoryItem
          fileStructure={drives}
          key={drive}
          location={[drive]}
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

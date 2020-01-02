import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDrives, setCurrentLocation } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import DirectoryItem from './DirectoryItem';

const FileStructure = () => {
  const getDrivesAction = useAction(getDrives);
  const setCurrentLocationAction = useAction(setCurrentLocation);
  const fileStructure = useSelector((state: ReducerState) => state.fileStructureState.fileStructure);

  useEffect(() => {
    getDrivesAction();
  }, []);

  return <div style={styles.container}>
    {Object.keys(fileStructure)
      .map((drive: string) =>
        <DirectoryItem
          fileStructure={fileStructure}
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

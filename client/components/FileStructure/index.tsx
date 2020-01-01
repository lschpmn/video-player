import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDrives, getFiles, inspectFile, setCurrentLocation } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { Directory, ReducerState } from '../../types';
import DirectoryStructure from '../DirectoryStructure';

const FileStructure = () => {
  const inspectFileAction = useAction(inspectFile);
  const getDrivesAction = useAction(getDrives);
  const getFilesAction = useAction(getFiles);
  const setCurrentLocationAction = useAction(setCurrentLocation);
  const drives = useSelector((state: ReducerState) => state.explorer.drives);
  const inspections = useSelector((state: ReducerState) => state.explorer.inspections);

  useEffect(() => {
    getDrivesAction();
  }, []);

  return <div style={styles.container}>
    {
      Object
        .entries(drives)
        .map(([drive, directory]: [string, Directory | boolean]) => (
          <DirectoryStructure
            directory={directory}
            inspectFile={inspectFileAction}
            inspections={inspections}
            key={drive}
            onClick={getFilesAction}
            location={[drive]}
            setCurrentLocation={setCurrentLocationAction}
          />
        ))
    }
  </div>;
};

const styles = {
  container: {
    margin: '0 0.5rem',
  },
};

export default FileStructure;

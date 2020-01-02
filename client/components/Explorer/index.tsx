import { join } from 'path';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getFileItem } from '../../lib/utils';
import { ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const Explorer = () => {
  const fileStructureState = useSelector((state: ReducerState) => state.fileStructureState);
  const fileItem = getFileItem(fileStructureState.fileStructure, fileStructureState.currentLocation);

  const fileStructure = fileStructureState.currentLocation.length === 0
    ? fileStructureState.fileStructure
    : fileItem?.files;

  return <div style={styles.container}>
    {fileStructure && Object
      .entries(fileStructure)
      .sort(([aName, aItem], [bName, bItem]) => {
        if (aItem.type === 'dir' && bItem.type === 'dir') {
          return aName.localeCompare(bName);
        } else if (aItem.type === 'dir' && bItem.type === 'file') {
          return -1;
        } else if (aItem.type === 'file' && bItem.type === 'dir') {
          return 1;
        }

        return aName.localeCompare(bName);
      })
      .map(([name, item]) =>
        <ExplorerItem
          currentLocation={fileStructureState.currentLocation}
          drive={item}
          key={join(...fileStructureState.currentLocation, name)}
          name={name}
        />,
      )}
  </div>;
};

export default Explorer;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    margin: '0 0.5rem',
    overflow: 'auto',
  } as React.CSSProperties,
};

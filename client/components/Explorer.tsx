import Folder from '@material-ui/icons/Folder';
import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { ExplorerState, ReducerState } from '../types';

type Props = {
  explorer: ExplorerState,
};

class Explorer extends React.Component<Props> {
  render() {
    const { explorer } = this.props;
    const drives = explorer.currentLocation.length
      ? Object.keys(get(explorer.drives, explorer.currentLocation))
      : Object.keys(explorer.drives);

    return <div style={styles.container}>
      {drives.map(drive =>
        <div key={drive} style={styles.folder}>
          <Folder style={styles.folderIcon}/>
          <div style={styles.folderText}>{drive}</div>
        </div>,
      )}
    </div>;
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    margin: '0 0.5rem',
    overflow: 'auto',
  } as React.CSSProperties,
  folder: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
    width: '8rem',
  } as React.CSSProperties,
  folderIcon: {
    fontSize: '5rem',
    margin: '0 auto',
  } as React.CSSProperties,
  folderText: {
    textAlign: 'center',
    wordBreak: 'break-all',
  } as React.CSSProperties,
};

export default connect(
  (state: ReducerState) => ({
    explorer: state.explorer,
  }),
  {},
)(Explorer);

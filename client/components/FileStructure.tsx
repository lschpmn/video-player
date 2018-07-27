import * as React from 'react';
import { connect } from 'react-redux';
import { getDrives, getFiles } from '../lib/file-actions';
import DirectoryTab from './DirectoryTab';
import { Directory } from '../types';

type Props = {
  getDrives: typeof getDrives,
  getFiles: typeof getFiles,
  drives: DirectoryTab,
};

class FileStructure extends React.Component<Props> {
  componentDidMount() {
    this.props.getDrives();
  }

  getFiles = (location: string[]) => {
    return this.props.getFiles(location);
  };

  render() {
    const { drives } = this.props;

    return <div style={styles.container}>
      {
        Object
          .entries(drives)
          .map(([drive, directory]: [string, Directory | boolean]) => (
            <DirectoryTab
              directory={directory}
              key={drive}
              onClick={this.getFiles}
              location={[drive]}
            />
          ))
      }
    </div>;
  }
}

const styles = {
  container: {
    height: '100%',
    margin: '0 0.5rem',
    overflow: 'auto',
    width: '100%',
  },
};

export default connect(
  (state: any) => ({
    drives: state.explorer.drives,
  }),
  {
    getDrives,
    getFiles,
  }
// @ts-ignore
)(FileStructure);
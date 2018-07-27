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

  getFiles = (path: string, parent: string[]) => {
    return this.props.getFiles(path, parent);
  };

  render() {
    const { drives } = this.props;

    return <div style={{ margin: 10 }}>
      {
        Object
          .entries(drives)
          .map(([drive, directory]: [string, Directory | boolean]) => (
            <DirectoryTab
              directory={directory}
              key={drive}
              name={drive}
              onClick={this.getFiles}
              parent={[drive]}
            />
          ))
      }
    </div>;
  }
}

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
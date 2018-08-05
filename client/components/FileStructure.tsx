import * as React from 'react';
import { connect } from 'react-redux';
import { inspectFile, getDrives, getFiles } from '../lib/file-actions';
import DirectoryStructure from './DirectoryStructure';
import { Directory, Inspections } from '../types';

type Props = {
  inspectFile: typeof inspectFile,
  getDrives: typeof getDrives,
  getFiles: typeof getFiles,
  drives: DirectoryStructure,
  inspections: Inspections,
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
            <DirectoryStructure
              directory={directory}
              inspectFile={this.props.inspectFile}
              inspections={this.props.inspections}
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
    inspections: state.explorer.inspections,
  }),
  {
    inspectFile,
    getDrives,
    getFiles,
  }
// @ts-ignore
)(FileStructure);
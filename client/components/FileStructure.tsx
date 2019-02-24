import * as React from 'react';
import { connect } from 'react-redux';
import { inspectFile, getDrives, getFiles } from '../lib/file-actions';
import DirectoryStructure from './DirectoryStructure';
import { Directory, ExplorerState, Inspections } from '../types';

type Props = {
  inspectFile: typeof inspectFile,
  getDrives: typeof getDrives,
  getFiles: typeof getFiles,
  drives: Directory,
  inspections: Inspections,
};

class FileStructure extends React.Component<Props> {
  componentDidMount() {
    this.props.getDrives();
  }

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
              onClick={this.props.getFiles}
              location={[drive]}
            />
          ))
      }
    </div>;
  }
}

const styles = {
  container: {
    margin: '0 0.5rem',
  },
};

export default connect(
  (state: { explorer: ExplorerState }) => ({
    drives: state.explorer.drives,
    inspections: state.explorer.inspections,
  }),
  {
    inspectFile,
    getDrives,
    getFiles,
  }
)(FileStructure);
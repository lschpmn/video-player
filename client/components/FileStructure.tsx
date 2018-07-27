import * as React from 'react';
import { connect } from 'react-redux';
import { getDrives, getFiles } from '../lib/file-actions';
import Directory from './Directory';
import { FileEntry } from '../types';

type Props = {
  getDrives: typeof getDrives,
  getFiles: typeof getFiles,
  structure: FileEntry,
};

class FileStructure extends React.Component<Props> {
  componentDidMount() {
    this.props.getDrives();
  }

  getFiles = (path: string, parent: string[]) => {
    return this.props.getFiles(path, parent);
  };

  render() {
    const { structure } = this.props;

    return <div style={{ margin: 10 }}>
      {
        Object
          .entries(structure)
          .map(([directory]) => (
            <Directory
              key={directory}
              name={directory}
              onClick={this.getFiles}
              parent={[directory]}
            />
          ))
      }
    </div>;
  }
}

export default connect(
  (state: any) => ({
    structure: state.explorer.structure,
  }),
  {
    getDrives,
    getFiles,
  }
// @ts-ignore
)(FileStructure);
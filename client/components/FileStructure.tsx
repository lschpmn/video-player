import * as React from 'react';
import { connect } from 'react-redux';
import { getDrives, getFiles } from '../lib/file-actions';
import Directory from './Directory';
import { FileEntry } from '../types';

type Props = {
  getDrives: () => Promise<any>,
  getFiles: (path: string) => void,
  structure: FileEntry,
};

class FileStructure extends React.Component<Props> {
  async componentDidMount() {
    const { payload: drives } = await this.props.getDrives();
    console.log(drives);
  }

  getFiles = (path: string) => {
    this.props.getFiles(path);
  };

  render() {
    const { structure } = this.props;

    return <div style={{ margin: 10 }}>
      {
        Object
          .entries(structure)
          .map(([directory]) => <Directory key={directory} name={directory} onClick={this.getFiles} />)
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
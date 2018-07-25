import * as React from 'react';
import { connect } from 'react-redux';
import { getDrives, getFiles } from '../lib/file-actions';
import Directory from './Directory';
import { FileEntry } from '../types';

type Props = {
  getDrives: () => Promise<any>,
  structure: FileEntry,
};

class FileStructure extends React.Component<Props> {
  async componentDidMount() {
    const { payload: drives } = await this.props.getDrives();
    console.log(drives);
  }

  render() {
    const { structure } = this.props;

    return <div>
      File Structure
      {
        Object
          .entries(structure)
          .map(([directory]) => <Directory key={directory} name={directory} />)
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
  }
// @ts-ignore
)(FileStructure);
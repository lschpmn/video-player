import * as React from 'react';
import { connect } from 'react-redux';
import { getDrives, getFiles } from '../lib/file-actions';

type Props = {
  getDrives: () => Promise<any>;
};

class FileStructure extends React.Component<Props> {
  async componentDidMount() {
    const drives = await this.props.getDrives();
    console.log(drives);
  }

  render() {
    return <div>
      File Structure
    </div>;
  }
}

export default connect(
  state => state,
  {
    getDrives,
  }
// @ts-ignore
)(FileStructure);
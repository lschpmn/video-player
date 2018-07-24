import * as React from 'react';
import { getDrives, getFiles } from '../lib/file-actions';

export default class FileStructure extends React.Component {
  async componentDidMount() {
    const drives = await getDrives();
    console.log(drives);
  }

  render() {
    return <div>
      File Structure
    </div>;
  }
}
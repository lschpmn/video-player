import * as React from 'react';
import { getFiles } from '../lib/file-actions';

export default class FileStructure extends React.Component {
  componentDidMount() {
    getFiles('/');
  }

  render() {
    return <div>
      File Structure
    </div>;
  }
}
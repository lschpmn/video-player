import * as React from 'react';
import { getFiles, inspectFile } from '../lib/file-actions';
import { Directory } from '../types';
import { join } from 'path';

type Props = {
  inspectFile: typeof inspectFile,
  location: string[],
  onClick: typeof getFiles,
  directory: Directory | boolean,
};

type State = {
  open: boolean,
};

export default class DirectoryTab extends React.Component<Props, State> {
  state = {
    open: false,
  };

  async componentDidMount() {
    if (this.props.location.length === 1) return;
    const path = join(...this.props.location);

    const response = await this.props.inspectFile(path);
    console.log(response);
  }

  onClick = e => {
    e.stopPropagation();
    const { directory, location } = this.props;

    this.setState({ open: !this.state.open });
    if (typeof directory === 'boolean') this.props.onClick(location);
  };

  render() {
    const { directory, location } = this.props;
    const name = location.slice(-1)[0];

    return <div
      onMouseDown={this.onClick}
      style={styles.container}
    >
      {name}
      {typeof directory === 'object' && this.state.open &&
        Object
          .entries(directory)
          .map(([parentDirectory, directory]: [string, Directory | boolean]) => (
            <DirectoryTab
              directory={directory}
              inspectFile={this.props.inspectFile}
              key={parentDirectory}
              onClick={this.props.onClick}
              location={[...location, parentDirectory]}
            />
          ))
        }
    </div>;
  }
}

const styles = {
  container: {
    padding: '0.2rem 0 0.2rem 0.5rem',
  },
};
import * as React from 'react';
import { getFiles, inspectFile } from '../lib/file-actions';
import { Directory, Inspections } from '../types';
import { join } from 'path';

type Props = {
  inspectFile: typeof inspectFile,
  location: string[],
  onClick: typeof getFiles,
  directory: Directory | boolean,
  inspections: Inspections,
};

type State = {
  open: boolean,
  show: boolean,
};

export default class DirectoryStructure extends React.Component<Props, State> {
  state = {
    open: false,
    show: false,
  };

  componentDidMount() {
    const { inspectFile, inspections, location } = this.props;
    const path = join(...location);
    const shouldOpen = this.shouldOpen();
    if (shouldOpen) this.setState({ show: true });
    else if (!inspections[path]) inspectFile(path);
  }

  componentDidUpdate(prevProps: Props) {
    const { inspections, location } = this.props;
    const path = join(...location);
    const inspect = inspections[path];
    const prevInspect = prevProps.inspections[path];

    if (inspect && !prevInspect
      && this.shouldOpen()) this.setState({ show: true });
  }

  onClick = e => {
    e.stopPropagation();
    const { directory, location } = this.props;

    this.setState({ open: !this.state.open });
    if (typeof directory === 'boolean') this.props.onClick(location);
  };

  shouldOpen() {
    const { inspections, location } = this.props;
    const path = join(...location);
    const inspect = inspections[path];

    return location.length === 1 ||
      inspect &&
      inspect.type === 'dir' &&
      location.slice(-1)[0][0] !== '.';
  }

  render() {
    const { directory, location } = this.props;
    const { show } = this.state;
    const name = location.slice(-1)[0];

    return <div
      onMouseDown={this.onClick}
      style={{
        ...styles.container,
        display: show ? 'block' : 'none',
      }}
    >
      {name}
      {typeof directory === 'object' && this.state.open &&
        Object
          .entries(directory)
          .map(([parentDirectory, directory]: [string, Directory | boolean]) => (
            <DirectoryStructure
              directory={directory}
              inspectFile={this.props.inspectFile}
              inspections={this.props.inspections}
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
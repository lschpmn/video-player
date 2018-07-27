import * as React from 'react';
import { getFiles } from '../lib/file-actions';
import { Directory } from '../types';

type Props = {
  name: string,
  onClick: typeof getFiles,
  parent: string[],
  directory: Directory | boolean,
};

type State = {
  open: boolean,
};

export default class DirectoryTab extends React.Component<Props, State> {
  state = {
    open: false,
  };

  onClick = () => {
    const { directory, name, parent } = this.props;
    debugger;

    if (typeof directory === 'boolean') this.props.onClick(name + '/', parent);
  };

  render() {
    const { directory, name, parent } = this.props;

    return <div
      onMouseDown={this.onClick}
      style={styles.container}
    >
      {name}
      {typeof directory === 'object' &&
        Object
          .entries(directory)
          .map(([parentDirectory, directory]: [string, Directory | boolean]) => (
            <DirectoryTab
              directory={directory}
              key={parentDirectory}
              name={parentDirectory}
              onClick={this.props.onClick}
              parent={[parentDirectory, name]}
            />
          ))
        }
    </div>;
  }
}

const styles = {
  card: {
    padding: '0.25rem',
    margin: '1rem 0',
  },

  container: {
    padding: '0.5rem 0',
  },
};
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

  render() {
    const { name, parent } = this.props;

    return <div
      onMouseDown={() => this.props.onClick(name + '/', parent)}
      style={styles.container}
    >
      {name}
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
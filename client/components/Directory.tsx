import * as React from 'react';
import { getFiles } from '../lib/file-actions';

type Props = {
  name: string,
  onClick: typeof getFiles,
  parent: string[],
};

export default class Directory extends React.Component<Props> {
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
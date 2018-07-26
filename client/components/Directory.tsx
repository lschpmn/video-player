import * as React from 'react';

type Props = {
  name: string,
  onClick: (path: string) => void,
};

export default class Directory extends React.Component<Props> {
  render() {
    const { name } = this.props;

    return <div
      onMouseDown={() => this.props.onClick(name + '/')}
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
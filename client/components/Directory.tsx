import * as React from 'react';
import { Card, CardText } from 'material-ui/Card';

type Props = {
  name: string,
};

export default class Directory extends React.Component<Props> {
  render() {
    const { name } = this.props;

    return <div>
      <Card containerStyle={{ padding: 0 }}>
        <CardText style={styles.card}>{name}</CardText>
      </Card>
    </div>;
  }
}

const styles = {
  card: {
    padding: '0.5rem',
    margin: '1rem 0',
  },
};
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import T from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReducerState } from '../../types';

const ContinueModal = () => {
  const [open, setOpen] = useState(false);
  const title = useSelector((state: ReducerState) => state.chromecastStore?.mediaStatus?.title);

  useEffect(() => console.log(title), [title]);

  return open && (
    <div style={styles.container}>
      <Card>
        <CardContent>
          Continue from 0:30?
        </CardContent>
        <CardActions style={styles.cartActions}>
          <Button color='primary' variant='outlined'>Yes</Button>
          <T color='error'>
            <Button color='inherit' variant='outlined'>No</Button>
          </T>
        </CardActions>
      </Card>
    </div>
  );
};

export default ContinueModal;

const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.5)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  } as React.CSSProperties,
  cartActions: {
    display: 'flex',
    justifyContent: 'space-between',
  } as React.CSSProperties,
};

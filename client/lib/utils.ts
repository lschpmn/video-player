import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const colors = {
  primary: blue['500'],
  secondary: green['500'],
  neutral: grey['500'],
  danger: red['500'],
};

export const useAction = <T extends Function>(action: T, deps?): T => {
  const dispatch = useDispatch();

  return useCallback((...args) =>
    dispatch(action(...args)), deps ? [dispatch, ...deps] : [dispatch]) as any;
};

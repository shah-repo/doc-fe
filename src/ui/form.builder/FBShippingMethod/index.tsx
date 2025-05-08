import { Grid } from '@material-ui/core';
import React from 'react';
import FBSelect from '../FBSelect/FBSelect';
import { FBSelectProps } from '../FBSelect/FBSelect.types';
import useStyles from './styles';

const FBShippingMethod: React.FC<FBSelectProps> = (props) => {
  const classes = useStyles();
  console.log('props', props);
  return (
    <Grid container className={classes.grid}>
      <h1>Shipping Method</h1>
      <FBSelect {...props} />
    </Grid>
  );
};

export default FBShippingMethod;

import { Grid } from '@material-ui/core';
import React from 'react';
import FBSelect from '../FBSelect/FBSelect';
import { FBSelectProps } from '../FBSelect/FBSelect.types';
import useStyles from './styles';

const FBShippingMethod: React.FC<FBSelectProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <FBSelect {...props} />
    </Grid>
  );
};

export default FBShippingMethod;

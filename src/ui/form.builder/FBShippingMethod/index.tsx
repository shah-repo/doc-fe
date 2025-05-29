import { Grid } from '@material-ui/core';
import React from 'react';
import FBSelect from '../FBSelect/FBSelect';
import useStyles from './styles';
import { FBShippingMethodProps } from './types';
import { withFBShippingMethod } from './wrap';

const FBShippingMethod: React.FC<FBShippingMethodProps> = ({ selectKey, ...props }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <Grid item xs>
        <FBSelect
          {...props}
          key={`select-${selectKey ?? 'none'}}`}
          data-cy="shipping-method-field"
        />
      </Grid>
    </Grid>
  );
};

export default withFBShippingMethod(FBShippingMethod);

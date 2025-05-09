import { Grid } from '@material-ui/core';
import React from 'react';
import FBSelect from '../FBSelect/FBSelect';
import { FBSelectProps } from '../FBSelect/FBSelect.types';
import useStyles from './styles';
import { withFBShippingMethod } from './wrap';

const FBShippingMethod: React.FC<FBSelectProps> = (props) => {
  const classes = useStyles();
  console.log('props', props);
  return (
    <Grid container className={classes.grid}>
      <Grid item xs>
        <FBSelect
          {...props}
          defaultValue=""
          withState
          data-cy="shipping-method-field"
        />
      </Grid>
    </Grid>
  );
};

export default withFBShippingMethod(FBShippingMethod);

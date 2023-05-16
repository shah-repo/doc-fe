import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { styles } from './newStyles';
import { SummaryBaseProps } from './types';

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = '-' }) => {
  const classes = styles();
  return (
    <Grid item={true} xs={12} className={classes.container}>
      <Typography id="field-name" data-cy="field-name" className={classes.title} variant="h5">
        {value ? value : noValueOption}
      </Typography>
    </Grid>
  );
};

export default Base;

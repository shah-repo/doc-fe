import { Typography } from '@material-ui/core';
import React from 'react';
import Text from '../../../components/Text';
import { styles } from './NoDataFound.styles';

const NoDataFound: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <Typography className={classes.font}>
      <Text translation="table.no.results.found" />
    </Typography>
  );
};

export default NoDataFound;

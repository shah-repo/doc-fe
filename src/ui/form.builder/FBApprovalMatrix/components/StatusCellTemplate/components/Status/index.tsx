import React from 'react';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import useStyles from './styles';
import { translate } from '../../../../../../../common/intl';

const Status: React.FC<{ value: boolean }> = (props) => {
  const { value } = props;

  const classes = useStyles();

  return (
    <Box className={classes.status}>
      <Box className={cx(classes.circle, { [classes.circleActive]: value })} />
      {translate(value ? 'common.active' : 'common.inactive')}
    </Box>
  );
};

export default Status;

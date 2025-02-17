import { Box, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import useStyles from './styles';

const Welcome: React.FC = () => {
  const classes = useStyles();
  const employeeName = useSelector(authSelectors.currentUserName);

  return (
    <Box className={classes.root}>
      <Typography variant="caption" component="div" className={cx(classes.text)}>
        {translate('header.welcome.back')}, <b className={classes.name}>{employeeName}!</b>
      </Typography>
    </Box>
  );
};

export default Welcome;

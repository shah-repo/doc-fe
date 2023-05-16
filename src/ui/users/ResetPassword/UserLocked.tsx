import { Box, Paper, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logo } from '../../../common/utils/helpers';
import { authActions } from '../../../state/ducks/auth';
import FBStore from '../../form.builder/stores/ui/FBStore';
import { styles } from './ResetPasswordSuccessful.styles';

const UserLocked: React.FunctionComponent<{}> = () => {
  const classes = styles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
        <Box display="flex" textAlign="center" mb={5} data-cy="UserLocked-lockedInfo">
          <Typography variant="h5"className={classes.lockedInfo}>
            Your account has been locked.
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" mb={5} data-cy="UserLocked-infoLink">
          <Typography variant="h5"className={classes.lockedInfo}>
          Please contact your Company Admin for Enlil to reset your password.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default UserLocked;

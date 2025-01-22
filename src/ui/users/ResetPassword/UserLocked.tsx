import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { translate } from '../../../common/intl';
import { logo } from '../../../common/utils/helpers';
import { authActions } from '../../../state/ducks/auth';
import FBStore from '../../form.builder/stores/ui/FBStore';
import useStyles from './ResetPassword.styles';

const UserLocked: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    FBStore.clearStores();
    dispatch(authActions.logout());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
      </div>
      <div className={classes.content}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <div data-cy="reset-password-successful-title">
              <Typography variant="h1" className={classes.title}>
                {translate('user.locked.title')}
              </Typography>
            </div>
            <div data-cy="user-locked-info-link">
              <Typography variant="h2" className={classes.info}>
                {translate('user.locked.info')}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLocked;

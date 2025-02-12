import { Typography } from '@material-ui/core';
import cx from 'classnames';
import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { logo } from '../../../common/utils/helpers';
import { Button } from '../../components/forms/fields-next';
import { LOGIN_URL } from '../../constants/urls';
import { withThemeNext } from '../../layout/theme-next';
import useStyles from './ResetPassword.styles';

export const REDIRECT_DELAY = 5000;

type Props = Pick<RouteComponentProps, 'history'>;

const ResetPasswordSuccessful: React.FC<Props> = ({
  history,
}) => {
  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      history.push(LOGIN_URL);
    }, REDIRECT_DELAY);
  }, [history]);

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
                {translate('reset.password.successful')}
              </Typography>
            </div>
            <div data-cy="reset-password-successful-info">
              <Typography variant="h2" className={classes.info}>
                {translate('reset.password.successful.info')}
              </Typography>
              <Link to={LOGIN_URL} className={cx(classes.link, classes.info)}>
                {translate('reset.password.successful.info.link')}
              </Link>
            </div>
          </div>
          <Button
            id="ResetPasswordSuccessful-signUp"
            className={cx(classes.submitButton, classes.redirectButton)}
            onClick={() => history.push(LOGIN_URL)}
          >
            <span>{translate('login.submit')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withThemeNext(ResetPasswordSuccessful);

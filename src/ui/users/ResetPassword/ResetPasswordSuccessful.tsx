import { Box, Button, Paper, Typography } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { logo } from '../../../common/utils/helpers';
import Text from '../../components/Text';
import { LOGIN_URL } from '../../constants/urls';
import { styles } from './ResetPasswordSuccessful.styles';

const ResetPasswordSuccessful: React.FunctionComponent<{}> = () => {
  const history = useHistory();
  const classes = styles();

  useEffect(() => {
    setTimeout(() => {
      history.push(LOGIN_URL);
    }, 5000);
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
        <Box display="flex" textAlign="center" mb={5} data-cy="ResetPasswordSuccessful-title">
          <Typography variant="caption" className={classes.title}>
            <Text translation="reset.password.successful" />
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" data-cy="ResetPasswordSuccessful-info">
          <Typography variant="h5"className={classes.passwordSuccessfulInfo}>
            <Text translation="reset.password.successful.info" />
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" mb={5} data-cy="ResetPasswordSuccessful-infoLink">
          <Link to={LOGIN_URL}>
            <Typography variant="h5"className={classes.passwordSuccessfulInfo}>
              <Text translation="reset.password.successful.info.link" />
            </Typography>
          </Link>
        </Box>
        <Button
          className={classes.submit}
          id="ResetPasswordSuccessful-signUp"
          variant="contained"
          color="secondary"
          onClick={() => { history.push(LOGIN_URL); }}
        >
          <Text message="login.submit" />
        </Button>
      </Paper>
    </div>
  );
};

export default ResetPasswordSuccessful;

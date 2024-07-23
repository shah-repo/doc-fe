import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { translate } from '../../common/intl';
import Config from '../../config';
import { authActions, authSelectors } from '../../state/ducks/auth';
import { SSO_LOGIN_URL } from '../../state/ducks/auth/constants';
import { Employee } from '../../state/ducks/company/types';
import { ApplicationState } from '../../state/reducers';
import { Button } from '../components/forms/fields-next';
import { toastError, toastInfo, toastSuccess } from '../components/notifications';
import { COMPANY_EMAIL, HOME_URL, RESET_PASSWORD_URL } from '../constants/urls';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import SwitchCompanyContainer from './SwitchCompany/SwitchCompany.container';

interface StateProps {
  isUserAuthenticated: boolean
  employees: Employee[]
  hasMultipleCompanies: boolean
  passwordSoonToExpire: boolean
  daysUntilPasswordExpires: number
  isScheduledForDeletion: boolean
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, 'location'>;

const redirectToSSO = () => {
  window.location.href = `${Config.ApiEndpoint}${SSO_LOGIN_URL}`;
};

const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state ?? { from: { pathname: HOME_URL } };
  const intl = useIntl();
  const async = useAsync({
    onError: (message) => {
      toastError(
        <Box display="flex">
          <Box mr={2}>
            <div><b>{translate('login.error')}</b></div>
            <small>{message}</small>
          </Box>
          <Button kind="white" onClick={redirectToSSO}>{translate('errors.fetch.tryAgain')}</Button>
        </Box>,
        {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
        },
      );
    },
  });
  const loginSSOAction = useActionCreator(authActions.loginSSO);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    if (code && !props.isUserAuthenticated) {
      async.start(loginSSOAction, { code }, async);
    }
  }, [code, props.isUserAuthenticated]);

  if (props.isUserAuthenticated) {
    if (props.hasMultipleCompanies) {
      return (
        <SwitchCompanyContainer
          {...props}
        />
      );
    }

    props.passwordSoonToExpire && toastInfo(
      <div>
        Your password will expire in {props.daysUntilPasswordExpires} days.&nbsp;
        <Link to={RESET_PASSWORD_URL}>Reset it now.</Link>
      </div>,
      { autoClose: 10000 },
    );

    props.isScheduledForDeletion && toastSuccess(
      <div>
        {intl.formatMessage({ id: 'toast.notification.deletion' })}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
      </div>,
      { autoClose: 15000 },
    );

    return <Redirect to={from} />;
  }

  if (!code && !props.isUserAuthenticated) {
    redirectToSSO();
  }

  return (
    <Box top={0} left={0} right={0} bottom={0} display="flex" alignItems="center" justifyContent="center" flexDirection="column" position="fixed">
      <CircularProgress size={20} />
      <Box mt={2}>{translate('login.logging.in')}</Box>
    </Box>
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
  passwordSoonToExpire: authSelectors.getPasswordSoonToExpire(state),
  daysUntilPasswordExpires: authSelectors.getDaysUntilPasswordExpires(state),
  isScheduledForDeletion: authSelectors.getIsScheduledForDeletion(state),
});

export default connect<StateProps, unknown, unknown, ApplicationState>(mapStateToProps)(LoginContainer);

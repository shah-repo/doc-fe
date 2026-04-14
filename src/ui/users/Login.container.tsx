import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { translate } from '../../common/intl';
import Config from '../../config';
import { authActions, authSelectors } from '../../state/ducks/auth';
import { SSO_LOGIN_URL, SSO_REDIRECT_PARAM } from '../../state/ducks/auth/constants';
import { Employee } from '../../state/ducks/company/types';
import { ApplicationState } from '../../state/reducers';
import { Button } from '../components/forms/fields-next';
import { toastError, toastSuccess } from '../components/notifications';
import { COMPANY_EMAIL, HOME_URL, NO_ACCESS } from '../constants/urls';
import useActionCreator from '../hooks/useActionCreator';
import useAsync from '../hooks/useAsync';
import { showPasswordExpiryToast } from './PasswordExpiryToast';
import SwitchCompanyContainer from './SwitchCompany/SwitchCompany.container';
import { RETURN_URL_STORAGE_KEY, tryRedirectToReturnUrl } from '../../utils/returnUrl';

interface StateProps {
  isUserAuthenticated: boolean
  employees: Employee[]
  hasCompanies: boolean
  hasMultipleCompanies: boolean
  passwordSoonToExpire: boolean
  daysUntilPasswordExpires: number
  isScheduledForDeletion: boolean
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, 'location'>;

const IS_DEV_BUILD = process.env.NODE_ENV === 'development';

const redirectToSSO = () => {
  const redirectUrl = new URL(`${Config.ApiEndpoint}${SSO_LOGIN_URL}`, window.location.origin);

  if (IS_DEV_BUILD) {
    redirectUrl.searchParams.append(SSO_REDIRECT_PARAM, window.location.origin);
  }
  window.location.href = redirectUrl.toString();
};

const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state ?? { from: { pathname: HOME_URL } };
  const intl = useIntl();
  // returnUrl from URL param (direct visit from target server redirect) takes
  // priority; sessionStorage holds it across the Keycloak OAuth round-trip.
  const urlReturnUrl = new URLSearchParams(window.location.search).get('returnUrl');
  const returnUrl = urlReturnUrl ?? sessionStorage.getItem(RETURN_URL_STORAGE_KEY);
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
    const params = {
      code,
      [SSO_REDIRECT_PARAM]: IS_DEV_BUILD ? window.location.origin : undefined,
    };
    if (code && !props.isUserAuthenticated) {
      async.start(loginSSOAction, params, async);
    }
  }, [code, props.isUserAuthenticated]);

  if (props.isUserAuthenticated) {
    // Company selection must happen before any returnUrl redirect,
    // otherwise the user gets bounced to target frontend without a selected company.
    if (props.hasMultipleCompanies) {
      return (
        <SwitchCompanyContainer
          {...props}
          returnUrl={returnUrl}
        />
      );
    }

    // If returnUrl was provided (e.g. from target frontend redirect), navigate there
    // after authentication succeeds — but only if it's a safe URL.
    if (tryRedirectToReturnUrl(returnUrl)) return null;

    if (!props.hasCompanies) {
      return <Redirect to={NO_ACCESS} />;
    }

    if (props.passwordSoonToExpire) {
      showPasswordExpiryToast(props.daysUntilPasswordExpires);
    }

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
    // Save returnUrl before SSO redirect — Keycloak's callback drops extra query params.
    if (urlReturnUrl) {
      sessionStorage.setItem(RETURN_URL_STORAGE_KEY, urlReturnUrl);
    }
    redirectToSSO();
  }

  return (
    <Box top={0} left={0} right={0} bottom={0} display="flex" alignItems="center" justifyContent="center" flexDirection="column" position="fixed">
      <CircularProgress size={20} />
      {code && <Box mt={2}>{translate('login.logging.in')}</Box>}
    </Box>
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
  hasCompanies: authSelectors.hasCompanies(state),
  passwordSoonToExpire: authSelectors.getPasswordSoonToExpire(state),
  daysUntilPasswordExpires: authSelectors.getDaysUntilPasswordExpires(state),
  isScheduledForDeletion: authSelectors.getIsScheduledForDeletion(state),
});

export default connect<StateProps, unknown, unknown, ApplicationState>(mapStateToProps)(LoginContainer);

import { WithStyles, withStyles } from '@material-ui/core';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRouteContainer from '../components/routes/PrivateRoute.container';
import { CONFIRM_FORGOT_PASSWORD_URL, EXPORTED_FILE_DOWNLOAD, LOGIN_URL, LOGIN_WITH_CODE_URL, MAINTENANCE, NEW_USER_SET_PASSWORD, RESET_PASSWORD_SUCCESSFUL_URL, RESET_PASSWORD_URL, SIGNUP_URL, STATUS, SUPPLIER_SURVEY_URL, USER_LOCKED } from '../constants/urls';
import Maintenance from '../maintenance/Maintenance';
import ExportFileDownload from '../status/ExportFileDownload';
import StatusPresenter from '../status/Status.presenter';
import SupplierSurveyContainer from '../users/forms/SupplierSurvey/SupplierSurvey.container';
import LoginContainer from '../users/Login.container';
import LoginWithCodeContainer from '../users/LoginWithCode.container';
import ResetPassword from '../users/ResetPassword/ResetPassword';
import ResetPasswordSuccessful from '../users/ResetPassword/ResetPasswordSuccessful';
import UserLocked from '../users/ResetPassword/UserLocked';
import NewUserSetPasswordContainer from '../users/SignUp/NewUserSetPassword.container';
import SetForgotPasswordContainer from '../users/SignUp/SetForgotPassword.container';
import SignUpContainer from '../users/SignUp/SignUp.container';
import styles from './App.styles';
import { DataDog } from './DataDog';
import Layout from './Layout';

type Props = WithStyles<typeof styles>;

const Routes: React.FunctionComponent<Props> = ({ classes }) => (
  <div>
    <ToastContainer autoClose={false} />
    <DataDog />
    <Switch>
      <Route
        path={LOGIN_URL}
        exact={true}
        component={LoginContainer}
      />
      <Route
        path={LOGIN_WITH_CODE_URL}
        exact={true}
        component={LoginWithCodeContainer}
      />
      <Route
        path={SIGNUP_URL}
        exact={true}
        component={SignUpContainer}
      />
      <Route
        path={CONFIRM_FORGOT_PASSWORD_URL}
        exact={true}
        component={SetForgotPasswordContainer}
      />
      <Route
        path={NEW_USER_SET_PASSWORD}
        exact={true}
        component={NewUserSetPasswordContainer}
      />
      <Route
        path={RESET_PASSWORD_URL}
        exact={true}
        component={ResetPassword}
      />
      <Route
        path={RESET_PASSWORD_SUCCESSFUL_URL}
        exact={true}
        component={ResetPasswordSuccessful}
      />
      <Route
        path={USER_LOCKED}
        exact={true}
        component={UserLocked}
      />
      <Route
        path={SUPPLIER_SURVEY_URL}
        exact={true}
        component={SupplierSurveyContainer}
      />
      <Route
        path={STATUS}
        exact={true}
        component={StatusPresenter}
      />
      <Route
        path={MAINTENANCE}
        exact={true}
        component={Maintenance}
      />
      <Route
        path={EXPORTED_FILE_DOWNLOAD}
        exact={true}
        component={ExportFileDownload}
      />
      <PrivateRouteContainer component={Layout} />
    </Switch>
  </div>
);

export default withStyles(styles)(Routes);

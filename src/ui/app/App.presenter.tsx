import { WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { redirectTo } from "../../common/redirectHandler";
import Config from "../../config";
import PrivateRouteContainer from "../components/routes/PrivateRoute.container";
import { LOGIN_URL, LOGIN_WITH_CODE_URL, SIGNUP_URL, STATUS, SUPPLIER_SURVEY_URL } from "../constants/urls";
import StatusPresenter from "../status/Status.presenter";
import SupplierSurveyContainer from "../users/forms/SupplierSurvey/SupplierSurvey.container";
import LoginContainer from "../users/Login.container";
import LoginWithCodeContainer from "../users/LoginWithCode.container";
import styles from "./App.styles";
import Layout from "./Layout";

interface Props extends WithStyles<typeof styles> {}

const AppPresenter: React.FunctionComponent<Props> = ({ classes }) => (
  <div>
    <Switch>
      <Route path={LOGIN_URL} exact={true} component={LoginContainer} />
      <Route path={LOGIN_WITH_CODE_URL} exact={true} component={LoginWithCodeContainer} />
      <Route
        path={SIGNUP_URL}
        component={redirectTo(Config.SignUpUrl)}
      />
      <Route path={SUPPLIER_SURVEY_URL} exact={true} component={SupplierSurveyContainer} />
      <Route path={STATUS} exact={true} component={StatusPresenter} />
      <PrivateRouteContainer component={Layout} />
    </Switch>
  </div>
);

export default withStyles(styles)(AppPresenter);

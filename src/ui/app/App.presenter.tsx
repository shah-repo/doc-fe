import { WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRouteContainer from "../components/routes/PrivateRoute.container";
import { LOGIN_URL, LOGIN_WITH_CODE_URL } from "../constants/urls";
import LoginContainer from "../users/Login.container";
import LoginWithCodeContainer from "../users/LoginWithCode.container";
import styles from "./App.styles";
import Layout from "./Layout";

interface Props extends WithStyles<typeof styles> {}

const AppPresenter: React.FunctionComponent<Props> = ({ classes }) => (
  <div className={classes.root}>
    <Switch>
      <Route path={LOGIN_URL} exact={true} component={LoginContainer} />
      <Route path={LOGIN_WITH_CODE_URL} exact={true} component={LoginWithCodeContainer} />
      <PrivateRouteContainer component={Layout} />
    </Switch>
  </div>
);

export default withStyles(styles)(AppPresenter);

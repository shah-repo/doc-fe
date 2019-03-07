import { WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { LOGIN_URL } from "../constants/urls";
import Login from "../Login";
import styles from "./App.styles";
import Layout from "./Layout";

interface Props extends WithStyles<typeof styles> {}

const App: React.FunctionComponent<Props> = ({ classes }) => (
  <div className={classes.root}>
    <Switch>
      <Route path={LOGIN_URL} exact={true} component={Login} />
      <PrivateRoute component={Layout} />
    </Switch>
  </div>
);

export default withStyles(styles)(App);

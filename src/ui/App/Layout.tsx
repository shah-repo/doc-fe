import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { HOME_URL } from "../constants/urls";
import Header from "./Header";
import styles from "./Layout.styles";

type Props = WithStyles<typeof styles>;

const Dashboard = () => <h1>DASHBOARD</h1>;

const Layout: React.FunctionComponent<Props> = ({ classes }) => (
  <div>
    <Header />
    <main className={classes.layout}>
      <Switch>
        <Route path={HOME_URL} exact={true} component={Dashboard} />
        <Redirect to={{ pathname: HOME_URL }} />
      </Switch>
    </main>
  </div>
);

export default withStyles(styles)(Layout);

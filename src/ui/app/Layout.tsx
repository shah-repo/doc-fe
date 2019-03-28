import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DOCUMENT_CREATE_URL, DOCUMENT_ROOT_URL, HOME_URL } from "../constants/urls";
import DashboardContainer from "../dashboard/Dashboard.container";
import DocumentContainer from "../documents/Document.container";
import DocumentCreateContainer from "../documents/DocumentCreate.container";
import HeaderContainer from "./Header.container";
import styles from "./Layout.styles";

type Props = WithStyles<typeof styles>;

const Layout: React.FunctionComponent<Props> = ({ classes }) => (
  <div className={classes.layout}>
    <HeaderContainer />
    <Switch>
      <Route path={HOME_URL} exact={true} component={DashboardContainer} />
      <Route path={DOCUMENT_CREATE_URL} exact={true} component={DocumentCreateContainer} />
      <Route path={DOCUMENT_ROOT_URL} component={DocumentContainer} />
      <Redirect to={{ pathname: HOME_URL }} />
    </Switch>
  </div>
);

export default withStyles(styles)(Layout);

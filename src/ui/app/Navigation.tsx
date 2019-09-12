// tslint:disable:jsx-no-multiline-js
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Dashboard } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Logo from "../components/icons/Logo";
import {
  CHANGE_REQUEST_LIST_URL,
  DOCUMENT_REVISION_LIST_URL,
  FORM_BUILDER_URL,
  HOME_URL,
} from "../constants/urls";
import styles from "./Navigation.styles";
import NavigationLinkContainer from "./NavigationLink.container";

type NavigationProps = WithStyles<typeof styles> & RouteComponentProps;

const Navigation: React.FunctionComponent<NavigationProps> = ({ classes, location }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{ paper: classes.drawerPaper }}
    anchor="left"
  >
    <Toolbar className={classes.toolbar}>
      <Typography variant="h6"  className={classes.toolbarTitle}>
        <Link to={HOME_URL} className={classes.headerLink}>
          <Logo />
        </Link>
      </Typography>
    </ Toolbar>
    <List className={classes.list}>
      <NavigationLinkContainer
        url={HOME_URL}
        text="navigation.dashboard"
        Icon={Dashboard}
        currentPath={location.pathname}
        childrenUrls={[
          // { url: CHANGE_REQUEST_CREATE_URL, text: "navigation.createChangeRequest" },
        ]}
      />
      <NavigationLinkContainer
        url={DOCUMENT_REVISION_LIST_URL}
        text="navigation.document.list"
        Icon={Dashboard}
        currentPath={location.pathname}
      />
      <NavigationLinkContainer
        url={CHANGE_REQUEST_LIST_URL}
        text="navigation.change.request.list"
        Icon={Dashboard}
        currentPath={location.pathname}
      />
    </List>
  </Drawer>
);

export default withRouter(withStyles(styles)(Navigation));

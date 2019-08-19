// tslint:disable:jsx-no-multiline-js
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Dashboard } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Text from "../components/Text";
import {
  CHANGE_REQUEST_CREATE_URL,
  CHANGE_REQUEST_LIST_URL,
  DOCUMENT_REVISION_LIST_URL,
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
          <Text translation="header.title" />
        </Link>
      </Typography>
    </ Toolbar>
    <Divider />
    <List>
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
        childrenUrls={[
          { url: CHANGE_REQUEST_LIST_URL, text: "navigation.change.request.open" },
        ]}
      />
    </List>
  </Drawer>
);

export default withRouter(withStyles(styles)(Navigation));

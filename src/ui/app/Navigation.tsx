// tslint:disable:jsx-no-multiline-js
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { Dashboard } from "@material-ui/icons";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DOCUMENT_CREATE_URL, HOME_URL, CHANGE_REQUEST_CREATE_URL, CHANGE_REQUEST_LIST_URL } from "../constants/urls";
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
    <div className={classes.toolbar} />
    <Divider />
    <List>
      <NavigationLinkContainer
        url={HOME_URL}
        text="navigation.dashboard"
        Icon={Dashboard}
        currentPath={location.pathname}
        childrenUrls={[
          { url: DOCUMENT_CREATE_URL, text: "navigation.createDocument" },
          { url: CHANGE_REQUEST_CREATE_URL, text: "navigation.createChangeRequest" },
          { url: CHANGE_REQUEST_LIST_URL, text: "navigation.changeRequestList" },
        ]}
      />
    </List>
  </Drawer>
);

export default withRouter(withStyles(styles)(Navigation));

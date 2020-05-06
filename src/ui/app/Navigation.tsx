import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Dashboard } from "@material-ui/icons";
import React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import BottomLogo from "../components/icons/BottomLogo.container";
import Logo from "../components/icons/Logo.container";
import SwitchCompanyButtonContainer from "../components/icons/SwitchCompanyButton/SwitchCompanyButton.container";
import { CHANGE_REQUEST_LIST_URL, DOCUMENT_REVISION_LIST_URL, HOME_URL } from "../constants/urls";
import styles from "./Navigation.styles";
import NavigationLinkContainer from "./NavigationLink.container";
import DocumentByTypeListLinks from "./routes/DocumentByTypeList";
import GroupManagementLink from "./routes/GroupManagement";
import UserManagementLink from "./routes/UserManagement";

interface StateProps {
  hasMultipleCompanies: boolean;
}

type NavigationProps = StateProps &
WithStyles<typeof styles> &
RouteComponentProps;

const Navigation: React.FunctionComponent<NavigationProps> = ({
  classes,
  location,
  hasMultipleCompanies,
}) => (
  <Drawer
    PaperProps={{ id: "navigation" }}
    className={classes.drawer}
    variant="permanent"
    classes={{ paper: classes.drawerPaper }}
    anchor="left"
  >
    <Box flexGrow="1">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.toolbarTitle}>
          <Link to={HOME_URL} className={classes.headerLink}>
            <Logo />
          </Link>
        </Typography>
      </Toolbar>
      <List>
        <NavigationLinkContainer
          url={HOME_URL}
          text="navigation.dashboard"
          Icon={Dashboard}
          currentPath={location.pathname}
          childrenUrls={
            [
            // { url: CHANGE_REQUEST_CREATE_URL, text: "navigation.createChangeRequest" },
            ]
          }
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
        <UserManagementLink pathname={location.pathname} />
        <GroupManagementLink pathname={location.pathname} />
        <DocumentByTypeListLinks pathname={location.pathname} />
      </List>
    </Box>
    <Box paddingBottom="20px">
      {hasMultipleCompanies && (
        <SwitchCompanyButtonContainer location={location} />
      )}
      <BottomLogo />
    </Box>
  </Drawer>
);

const mapStateToProps = (state: ApplicationState): StateProps => ({
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(
  withRouter(withStyles(styles)(Navigation)),
);

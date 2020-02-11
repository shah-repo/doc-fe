import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Text from "../components/Text";
import { Translation } from "../translations/types";
import UserProfileContainer from "../user.management/profile/UserProfile.container";
import styles from "./Header.styles";

interface Props extends WithStyles<typeof styles> {
  email: string;
  name: string;
  pageTitle: Translation;
  onLogout: () => void;
  openUserProfile: () => void;
  closeUserProfile: () => void;
  showUserProfile: boolean;
}

const Header: React.FunctionComponent<Props> = ({
  classes,
  onLogout,
  name,
  pageTitle,
  openUserProfile,
  closeUserProfile,
  showUserProfile,
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar>
      <Grid
        container={true}
        spacing={10}
        justify="space-between"
        alignItems="center"
      >
        <Grid item={true} xs={6}>
          {pageTitle !== "translation.unknown" ? (
            <Typography variant="h6">
              <Text translation={pageTitle} />
            </Typography>
          ) : null}
        </Grid>
        <Grid item={true} xs={6}>
          <Grid container={true} justify="flex-end" alignItems="center">
            <Typography
              variant="caption"
              className={classes.welcomeText}
              noWrap={true}
            >
              <Text translation="header.welcome" />,
            </Typography>
            &nbsp;
            <Button
              className={classes.name}
              id="Header-userProfile"
              color="primary"
              variant="text"
              onClick={openUserProfile}
            >
              <Text translation="header.name" values={{ name }} />
            </Button>
            <Button color="primary" variant="text" onClick={onLogout}>
              <Text translation="header.logout" />
            </Button>
            <UserProfileContainer
              closeUserProfile={closeUserProfile}
              showUserProfile={showUserProfile}
            />
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);

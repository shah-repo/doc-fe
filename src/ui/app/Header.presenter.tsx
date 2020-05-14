import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Nullable } from "../../state/ducks/common/types";
import Text from "../components/Text";
import UserProfileContainer from "../user.management/profile/UserProfile.container";
import styles from "./Header.styles";
import UserAvatar from "./UserMenu/UserAvatar";
import UserMenu from "./UserMenu/UserMenu.container";

interface Props extends WithStyles<typeof styles> {
  email: string;
  name: string;
  closeUserProfile: () => void;
  showUserProfile: boolean;
  avatar: Nullable<string>;
}

const Header: React.FunctionComponent<Props> = ({
  classes,
  name,
  closeUserProfile,
  showUserProfile,
  avatar,
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Grid
        container={true}
        alignItems="flex-end"
        justify="flex-end"
      >
        <Grid item={true} xs={6}>
          <Grid container={true} justify="flex-end" alignItems="center">
            <UserAvatar avatar={avatar}/>
            <Typography
              id="Header-welcomeText"
              variant="caption"
              className={classes.welcomeText}
              noWrap={true}
            >
              <Text translation="header.welcome" />,
            </Typography>
              &nbsp;
            <Typography
              id="Header-userName"
              variant="caption"
              className={classes.name}
              noWrap={true}
            >
              {name}
            </Typography>
            <UserMenu/>
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

import { Button, Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { WithStyles, withStyles } from "@material-ui/core/styles";
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
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: Nullable<HTMLElement>;
  handleCloseMenu: () => void;
}

const Header: React.FunctionComponent<Props> = ({
  classes,
  name,
  closeUserProfile,
  showUserProfile,
  avatar,
  handleOpenMenu,
  handleCloseMenu,
  anchorEl,
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
            <ClickAwayListener onClickAway={handleCloseMenu} mouseEvent="onClick">
              <Button
                disableFocusRipple={true}
                disableRipple={true}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleOpenMenu(event)}
                classes={{ root: classes.headerButton }}
              >
                <UserAvatar avatar={avatar} />
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
                <UserMenu {...{ handleCloseMenu, anchorEl }} />
                <UserProfileContainer
                  closeUserProfile={closeUserProfile}
                  showUserProfile={showUserProfile}
                />
              </Button>
            </ClickAwayListener>

          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);

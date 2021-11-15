import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Nullable } from "../../state/ducks/common/types";
import UserProfileContainer from "../user.management/profile/UserProfile.container";
import styles from "./NavigationProfile.styles";
import UserAvatar from "./UserMenu/UserAvatar";
import UserMenu from "./UserMenu/UserMenu.container";

interface Props extends WithStyles<typeof styles> {
  // email: string;
  name: string;
  closeUserProfile: () => void;
  showUserProfile: boolean;
  avatar: Nullable<string>;
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: Nullable<HTMLElement>;
  handleCloseMenu: () => void;
}

const NavigationProfilePresenter: React.FunctionComponent<Props> = ({
  classes,
  // email,
  name,
  closeUserProfile,
  showUserProfile,
  avatar,
  handleOpenMenu,
  handleCloseMenu,
  anchorEl,
}) => (
  <Box alignItems="center"  justifyContent="space-between" className={classes.bottomPush}>
    <ClickAwayListener onClickAway={handleCloseMenu} mouseEvent="onClick">
      <Button
        disableFocusRipple={true}
        disableRipple={true}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          handleOpenMenu(event)
        }
        classes={{ root: classes.headerButton }}
      >
        <UserAvatar {...{ avatar, name }} />
        <Box component="div" alignItems="center" className={classes.emailPosition}>
          <Typography
            id="Header-userName"
            variant="caption"
            className={classes.nameStyle}
            noWrap={true}
          >
            {name}
          </Typography>
        </Box>
        {/* <Box alignItems="center" className={classes.emailPosition}>
          <Typography
            id="Header-userName"
            variant="caption"
            className={classes.emailStyle}
            noWrap={true}
          >
            {email}
          </Typography>
        </Box> */}
        <UserMenu {...{ handleCloseMenu, anchorEl }} />
        <UserProfileContainer
          closeUserProfile={closeUserProfile}
          showUserProfile={showUserProfile}
        />
      </Button>
    </ClickAwayListener>
  </Box>
);

export default withStyles(styles)(NavigationProfilePresenter);

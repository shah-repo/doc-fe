import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { Nullable } from "../../state/ducks/common/types";
import UserProfileContainer from "../user.management/profile/UserProfile.container";
import styles from "./NavigationProfile.styles";
import UserAvatar from "./UserMenu/UserAvatar";
import UserMenu from "./UserMenu/UserMenu.container";

interface Props extends WithStyles<typeof styles> {
  email: string;
  name: string;
  closeUserProfile: () => void;
  showUserProfile: boolean;
  avatar: Nullable<string>;
  initialColor: string;
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: Nullable<HTMLElement>;
  handleCloseMenu: () => void;
}

const NavigationProfilePresenter: React.FunctionComponent<Props> = ({
  classes,
  email,
  name,
  closeUserProfile,
  showUserProfile,
  avatar,
  initialColor,
  handleOpenMenu,
  handleCloseMenu,
  anchorEl,
}) => (
  <Box
    alignItems="center"
    justifyContent="space-between"
    className={classes.bottomPush}
  >
    <ClickAwayListener onClickAway={handleCloseMenu}>
      <Button
        disableFocusRipple={true}
        disableRipple={true}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          handleOpenMenu(event)
        }
        classes={{ root: classes.headerButton }}
      >
        <List style={{ width: "98%" }}>
          <ListItem style={{ padding: 0 }}>
            <ListItemAvatar>
              <UserAvatar {...{ avatar, initialColor, name }} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography data-cy="UserName" className={classes.nameStyle} noWrap={true}> {name}</Typography>
              }
              secondary={
                <Typography data-cy="UserEmail" className={classes.emailStyle} noWrap={true}> {email}</Typography>
              }
            />
            <UserMenu {...{ handleCloseMenu, anchorEl }} />
          </ListItem>
        </List>
        <UserProfileContainer
          closeUserProfile={closeUserProfile}
          showUserProfile={showUserProfile}
        />
      </Button>
    </ClickAwayListener>
  </Box>
);

export default withStyles(styles)(NavigationProfilePresenter);

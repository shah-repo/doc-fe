import { Button, FormControlLabel, Grid, Switch } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Nullable } from "../../state/ducks/common/types";
import Text from "../components/Text";
import Colors from "../layout/theme/utils/colors";
import UserProfileContainer from "../user.management/profile/UserProfile.container";
import AutosaveToggle from "./autosave/autosave";
import styles from "./NewHeader.styles";
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
  toggleCustomLabels: () => void;
  customLabelsValue: boolean;
  canToggleCustomLabels: boolean;
}
const style = {
  color: Colors.white,
  fontSize: "12px",
};

const Header: React.FunctionComponent<Props> = ({
  classes,
  name,
  closeUserProfile,
  showUserProfile,
  avatar,
  handleOpenMenu,
  handleCloseMenu,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
  anchorEl,
}) => (
  <AppBar position="fixed" color="primary" className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <div className={classes.logo}></div>
      <Grid
        container={true}
        wrap="nowrap"
        justify="space-between"
        alignContent="center"
      >
        <Grid item={true} zeroMinWidth>
          <Typography noWrap className={classes.toolbarTitle}>
            <Text translation="header.welcome.back" />,&nbsp;
            <b className={classes.toolbarTitleName}>{name}!</b>
          </Typography>
        </Grid>
        <Grid item={true} className={classes.wrapContainer}>
          <Box alignItems="center">
            {canToggleCustomLabels && (
              <FormControlLabel
                control={
                  <Switch
                    name="toggleCustomLabels"
                    checked={customLabelsValue}
                    onChange={toggleCustomLabels}
                  />
                }
                label="Show customizable labels"
                style={style}
              />
            )}
            <AutosaveToggle />
            <ClickAwayListener
              onClickAway={handleCloseMenu}
              mouseEvent="onClick"
            >
              <Button
                disableFocusRipple={true}
                disableRipple={true}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  handleOpenMenu(event)
                }
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
          </Box>
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);

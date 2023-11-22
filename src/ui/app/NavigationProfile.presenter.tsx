import { light } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { IotService } from '../../common/utils/iot/iotService';
import { authActions } from '../../state/ducks/auth';
import { Nullable } from '../../state/ducks/common/types';
import { tableSearchActions } from '../../state/ducks/tableSearch';
import Text from '../../ui/components/Text';
import SwitchCompanyButtonContainer from '../components/icons/SwitchCompanyButton/SwitchCompanyButton.container';
import FBStore from '../form.builder/stores/ui/FBStore';
import UserProfileContainer from '../user.management/profile/UserProfile.container';
import styles from './NavigationProfile.styles';
import UserAvatar from './UserMenu/UserAvatar';
import UserMenu from './UserMenu/UserMenu.container';
interface Props extends WithStyles<typeof styles> {
  email: string
  name: string
  closeUserProfile: () => void
  showUserProfile: boolean
  avatar: Nullable<string>
  initialColor: string
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void
  anchorEl: Nullable<HTMLElement>
  handleCloseMenu: () => void
  open: boolean
  location: any
}

const NavigationProfilePresenter: React.FunctionComponent<Props> = ({
  classes,
  email,
  name,
  location,
  closeUserProfile,
  showUserProfile,
  avatar,
  initialColor,
  handleOpenMenu,
  handleCloseMenu,
  anchorEl,
  open,
}) => {
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (showUserProfile) {
      return;
    }
    handleOpenMenu(event);
  };
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  };
  const handleSwitchCompany = () => {
    dispatch(authActions.clearNonAuthData());
    dispatch(tableSearchActions.clearAllTables());

    IotService.getInstance().end();
    dispatch(authActions.setCredentials(null));

    FBStore.clearStores();

    // history.push(LOGIN_URL);
  };

  return (<Box
    alignItems="center"
    justifyContent="space-between"
    className={cx({ [classes.bottomPush]: open, [classes.collapsedBottomPush]: !open })}
  >
    <Grid container wrap="nowrap" spacing={2} className={classes.mobileUserProfile}>
      <List>
        <ListItem>
          <Grid item>
            <ListItemAvatar className={classes.listItemAvatar}>
              <UserAvatar {...{ avatar, initialColor, name }} />
            </ListItemAvatar>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography data-cy="UserName" className={classes.nameStyle} noWrap={true}> {name}</Typography>
            <Typography data-cy="UserEmail" className={classes.emailStyle} noWrap={true}> {email}</Typography>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <MenuItem onClick={handleSwitchCompany} className={classes.menu}>
            <ListItemIcon className={classes.listItemIcon}>
              <FontAwesomeIcon className={classes.icon} icon={light('arrow-up-arrow-down')} rotation={90} />
            </ListItemIcon>
            <ListItemText>
              <SwitchCompanyButtonContainer location={location} />
            </ListItemText>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem
            data-cy="header.logout"
            onClick={handleLogout}
            className={classes.menu}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <FontAwesomeIcon className={classes.icon} icon={light('arrow-right-from-bracket')} />
            </ListItemIcon>
            <ListItemText className={classes.text} disableTypography>
              <Text translation="header.logout" />
            </ListItemText>
          </MenuItem>

        </ListItem>
      </List>
      <Divider />
    </Grid>
    <ClickAwayListener onClickAway={handleCloseMenu}>
      <Button
        disableFocusRipple={true}
        disableRipple={true}
        onClick={openMenu}
        classes={{ root: classes.headerButton }}
      >
        <List classes={{ root: classes.list }} >
          <ListItem classes={{ root: open ? classes.listItem : classes.collapsedListItem }} >
            <ListItemAvatar className={classes.listItemAvatar}>
              <UserAvatar {...{ avatar, initialColor, name }} />
            </ListItemAvatar>
            {open && <ListItemText
              primary={
                <Typography data-cy="UserName" className={classes.nameStyle} noWrap={true}> {name}</Typography>
              }
              secondary={
                <Typography data-cy="UserEmail" className={classes.emailStyle} noWrap={true}> {email}</Typography>
              }
            />}
            <UserMenu {...{ handleCloseMenu, anchorEl, open }} />
          </ListItem>
        </List>
        <UserProfileContainer
          closeUserProfile={closeUserProfile}
          showUserProfile={showUserProfile}
        />
      </Button>
    </ClickAwayListener>
  </Box>);
};

export default withStyles(styles)(NavigationProfilePresenter);

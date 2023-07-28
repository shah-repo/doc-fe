import { light, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React from 'react';
import { Nullable } from '../../../state/ducks/common/types';
import SwitchCompanyButtonContainer from '../../components/icons/SwitchCompanyButton/SwitchCompanyButton.container';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';
import { UserMenuContext } from '../NavigationProfile.container';
import styles from './styles';

interface Props {
  location: any
  anchorEl: Nullable<HTMLElement>
  handleCloseMenu: () => void
  open?: boolean
}

const UserMenuPresenter: React.FunctionComponent<Props> = ({
  location,
  anchorEl,
  handleCloseMenu,
  open,
}) => {
  const classes = styles();
  const {
    openUserProfile,
    openUserSettings,
    handleLogout,
    hasMultipleCompanies,
    handleSwitchCompany,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = React.useContext(UserMenuContext)!;

  return (
    <>
      {open && <MoreHorizIcon fontSize="small" style={{ color: Colors.white }} id="UserMenuButton" data-cy="UserMenuButton" />}
      <Menu
        id="UserMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        MenuListProps={{
          disablePadding: true,
        }}
      >
        <MenuItem onClick={openUserSettings} className={classes.menu} alignItems="center">
          <ListItemIcon className={classes.listItemIcon}>
            <FontAwesomeIcon className={classes.icon} icon={solid('gear')} />
          </ListItemIcon>
          <ListItemText>
            <Text translation="header.menu.my.settings" />
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={openUserProfile} className={classes.menu} alignItems="center">
          <ListItemIcon className={classes.listItemIcon}>
            <FontAwesomeIcon className={classes.icon} icon={light('user')} />
          </ListItemIcon>
          <ListItemText className={classes.text} disableTypography>
            <Text translation="header.menu.my.profile" />
          </ListItemText>
        </MenuItem>
        {hasMultipleCompanies
          && <MenuItem onClick={handleSwitchCompany} className={classes.menu}>
            <ListItemIcon className={classes.listItemIcon}>
              <FontAwesomeIcon className={classes.icon} icon={light('arrow-up-arrow-down')} rotation={90} />
            </ListItemIcon>
            <ListItemText>
              <SwitchCompanyButtonContainer location={location} />
            </ListItemText>
          </MenuItem>
        }
        <Divider variant="middle" className={classes.divider} />
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
      </Menu>
    </>
  );
};

export default UserMenuPresenter;

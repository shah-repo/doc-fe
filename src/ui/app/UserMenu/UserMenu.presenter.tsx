import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import SyncAltOutlinedIcon from '@material-ui/icons/SyncAltOutlined';
import React from 'react';
import { Nullable } from '../../../state/ducks/common/types';
import SwitchCompanyButtonContainer from '../../components/icons/SwitchCompanyButton/SwitchCompanyButton.container';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';
import { UserMenuContext } from '../NavigationProfile.container';

interface Props {
  location: any;
  anchorEl: Nullable<HTMLElement>;
  handleCloseMenu: () => void;
}

const UserMenuPresenter: React.FunctionComponent<Props> = ({
  location,
  anchorEl,
  handleCloseMenu,
}) => {
  const {
    openUserProfile,
    handleLogout,
    hasMultipleCompanies,
    handleSwitchCompany,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = React.useContext(UserMenuContext)!;

  return (
    <>
      <MoreHorizIcon fontSize="small" style={{ color: Colors.white }} id="UserMenuButton" data-cy="UserMenuButton" />
      <Menu
        id="UserMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={openUserProfile}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Text translation="header.menu.my.profile" />
          </ListItemText>
        </MenuItem>
        {hasMultipleCompanies &&
          <MenuItem onClick={handleSwitchCompany}>
            <ListItemIcon>
              <SyncAltOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <SwitchCompanyButtonContainer location={location} />
            </ListItemText>
          </MenuItem>
        }
        <MenuItem
          data-cy="header.logout"
          onClick={handleLogout}
          style={{ borderTop: `1px solid ${Colors.medium_gray}` }}
        >
          <ListItemIcon>
            <ExitToAppOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Text translation="header.logout" />
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenuPresenter;

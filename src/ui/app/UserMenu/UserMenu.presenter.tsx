import { IconButton, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import SyncAltOutlinedIcon from "@material-ui/icons/SyncAltOutlined";
import React from "react";
import SwitchCompanyButtonContainer from "../../components/icons/SwitchCompanyButton/SwitchCompanyButton.container";
import Text from "../../components/Text";
import { UserMenuContext } from "../Header.container";

interface Props {
  location: any;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
}

export const UserMenuPresenter: React.FunctionComponent<Props> = ({
  location,
  handleClick,
  anchorEl,
  handleClose,
}) => {
  const {
    openUserProfile,
    handleLogout,
    hasMultipleCompanies,
  } = React.useContext(UserMenuContext)!;

  return (
    <>
      <IconButton onClick={handleClick} id="UserMenuButton">
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>
      <Menu
        id="UserMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={openUserProfile}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>
            <Text translation="header.menu.my.profile" />
          </ListItemText>
        </MenuItem>
        {hasMultipleCompanies &&
          <MenuItem>
            <ListItemIcon>
              <SyncAltOutlinedIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>
              <SwitchCompanyButtonContainer location={location}/>
            </ListItemText>
          </MenuItem>
        }
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>
            <Text translation="header.logout" />
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  ); };

export default UserMenuPresenter;

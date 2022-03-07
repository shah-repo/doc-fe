import { IconButton, MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";

interface Props {
  // children: any[];
  children: any;
}

const HeaderMenu: React.FunctionComponent<Props> = ({ children }) => {
  if (!children.length) {
    children = [children];
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const items = children.filter((item) => item.props?.shouldDisplay || item.props?.shouldDisplay === undefined);

  if (items.every((item) => !item)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-cy="HeaderMenuButton"
        id="HeaderMenuButton"
        style={{ color: Colors.white }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="HeaderMenu"
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
        {children.map((menuItem, index) => {
          if (!menuItem) {
            return null;
          }
          return (
            <MenuItem
              onClick={handleClose}
              style={{
                display: menuItem?.props?.shouldDisplay === false ? "none" : "block",
                backgroundColor: Colors.white,
              }}
              key={index}
            >
              {menuItem}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default HeaderMenu;

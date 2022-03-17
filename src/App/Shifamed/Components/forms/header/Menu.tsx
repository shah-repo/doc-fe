import { IconButton, MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import React from "react";
import { ReactComponent as MoreVerticalIcon } from "../../../../../assets/images/more_vertical.svg";
import { styles } from "./Menu.styles";

interface Props {
  // children: any[];
  children: any;
}

const HeaderMenu: React.FunctionComponent<Props> = ({ children }) => {
  const classes = styles();
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
        className={classes.iconButton}
        disableRipple
      >
        <MoreVerticalIcon />
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
        className={classes.menu}
      >
        {children.map((menuItem, index) => {
          if (!menuItem) {
            return null;
          }
          return (
            <MenuItem
              onClick={handleClose}
              className={classes.menuItem}
              style={{
                display: menuItem?.props?.shouldDisplay === false ? "none" : "block",
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

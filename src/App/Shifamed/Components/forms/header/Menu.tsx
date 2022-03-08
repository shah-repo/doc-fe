import { IconButton, MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import React from "react";
import { ReactComponent as MoreVerticalIcon } from "../../../../../assets/images/more_vertical.svg";
import Colors from "../../../../../ui/layout/theme/utils/colors";

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
        style={{ color: Colors.white, marginRight: "20px" }}
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
        style = {{
          padding: "5px 0px",
          border: `1px solid ${Colors.gray_goose}`,
          boxSizing: "border-box",
          boxShadow: "0px 10px 30px rgba(22, 34, 41, 0.15)",
          borderRadius: "4px",
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
                margin: "0px",
                padding: "0px",
                width: "240px",
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

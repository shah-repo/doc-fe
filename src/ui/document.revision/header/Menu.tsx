import { IconButton, MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";

interface Props {
  children: any[];
}

export const HeaderMenu: React.FunctionComponent<Props> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  if (children.every((item) => !item)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(children);

  return (
    <>
      <IconButton onClick={handleClick} id="HeaderMenuButton">
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="HeaderMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children.map((menuItem, index) => {
          if (!menuItem) {
            return null;
          }
          return <MenuItem key={index}> {menuItem} </MenuItem>;
        })}
      </Menu>
    </>
  );
};

export default HeaderMenu;

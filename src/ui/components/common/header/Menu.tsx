import { IconButton, MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { ReactComponent as MoreVerticalIcon } from '../../../../assets/images/more_vertical.svg';
import { styles } from './Menu.styles';

interface Props {
  children: any
}

const HeaderMenu: React.FunctionComponent<Props> = ({ children }) => {
  if (!children.length) {
    children = [children];
  }
  const classes = styles();
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
      {SM.isNewLayout || SM.isNewCRLayout ? (
        <IconButton
          onClick={handleClick}
          data-cy="HeaderMenuButton"
          id="HeaderMenuButton"
          className={classes.iconButton}
          disableRipple
        >
          <MoreVerticalIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleClick}
          data-cy="HeaderMenuButton"
          id="HeaderMenuButton"
        >
          <MoreVertIcon />
        </IconButton>
      )}

      <Menu
        id="HeaderMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
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
              style={{
                display:
                  menuItem.props.shouldDisplay === false ? 'none' : 'block',
              }}
              className={classes.menuItem}
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

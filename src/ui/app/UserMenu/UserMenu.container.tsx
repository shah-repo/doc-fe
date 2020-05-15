import React from "react";
import { useLocation } from "react-router-dom";
import UserMenuPresenter from "./UserMenu.presenter";

export const UserMenuContainer: React.FunctionComponent = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <UserMenuPresenter
      {...{
        location,
        handleClick,
        anchorEl,
        handleClose,
      }}
    />
  );
};

export default UserMenuContainer;

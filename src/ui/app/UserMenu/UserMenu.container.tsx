import React from "react";
import { useLocation } from "react-router-dom";
import { Nullable } from "../../../state/ducks/common/types";
import UserMenuPresenter from "./UserMenu.presenter";

interface Props {
  anchorEl: Nullable<HTMLElement>;
  handleCloseMenu: () => void;
}

const UserMenuContainer: React.FunctionComponent<Props> = ({
  anchorEl,
  handleCloseMenu,
}) => {
  const location = useLocation();


  return (
    <UserMenuPresenter
      {...{
        location,
        anchorEl,
        handleCloseMenu,
      }}
    />
  );
};

export default UserMenuContainer;

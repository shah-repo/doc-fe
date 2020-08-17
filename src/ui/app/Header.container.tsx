import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import FBStore from "../form.builder/stores/ui/FBStore";
import HeaderPresenter from "./Header.presenter";

type Props = RouteComponentProps;

interface UserMenuContext {
  handleLogout: () => void;
  openUserProfile: () => void;
  hasMultipleCompanies: boolean;
}

export let UserMenuContext = React.createContext<UserMenuContext | undefined>(undefined);

const HeaderContainer: React.FunctionComponent<Props> = ({
  location,
  history,
}) => {

  const [showUserProfile, setUserProfile] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const email = useSelector(authSelectors.currentUserEmail);
  const name = useSelector(authSelectors.currentUserName);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  };

  const openUserProfile = () => {
    setUserProfile(true);
  };

  const closeUserProfile = () => setUserProfile(false);

  const hasMultipleCompanies = useSelector(authSelectors.hasMultipleCompanies);
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);

  UserMenuContext = React.createContext<UserMenuContext | undefined>({
    openUserProfile,
    handleLogout,
    hasMultipleCompanies,
  });

  return (
    <HeaderPresenter
      {...{
        email,
        name,
        closeUserProfile,
        showUserProfile,
        avatar,
        handleOpenMenu,
        handleCloseMenu,
        anchorEl,
      }}
    />
  );
};

export default withRouter(HeaderContainer);

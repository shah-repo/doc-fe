import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import { LOGIN_URL } from "../constants/urls";
import FBStore from "../form.builder/stores/ui/FBStore";
import useGetHasTag from "../hooks/useGetHasTag";
import HeaderPresenter from "./Header.presenter";

type Props = RouteComponentProps;

interface UserMenuContext {
  handleLogout: () => void;
  openUserProfile: () => void;
  hasMultipleCompanies: boolean;
  handleSwitchCompany: () => void;
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
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);

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
  const customLabelsValue = useSelector(authSelectors.isCustomLabelsOn);
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);

  /** Handles click on the Switch Company button. */
  const handleSwitchCompany = () => {
    history.push(LOGIN_URL);
    FBStore.clearStores();
  };

  UserMenuContext = React.createContext<UserMenuContext | undefined>({
    openUserProfile,
    handleLogout,
    hasMultipleCompanies,
    handleSwitchCompany,
  });

  const toggleCustomLabels = () => {
    dispatch(authActions.toggleCustomLabels(!customLabelsValue));
  };

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
        customLabelsValue,
        toggleCustomLabels,
        canToggleCustomLabels,
      }}
    />
  );
};

export default withRouter(HeaderContainer);

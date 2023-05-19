import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IotService } from '../../common/utils/iot/iotService';
import { authActions, authSelectors } from '../../state/ducks/auth';
import { tableSearchActions } from '../../state/ducks/tableSearch';
import { LOGIN_URL } from '../constants/urls';
import FBStore from '../form.builder/stores/ui/FBStore';
import NavigationProfilePresenter from './NavigationProfile.presenter';

type Props = RouteComponentProps;

interface UserMenuContext {
  handleLogout: () => void;
  openUserProfile: () => void;
  hasMultipleCompanies: boolean;
  handleSwitchCompany: () => void;
}

export let UserMenuContext = React.createContext<UserMenuContext | undefined>(
  undefined
);

const NavigationProfileContainer: React.FunctionComponent<Props> = ({
  history,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showUserProfile, setUserProfile] = useState(false);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserProfile = () => setUserProfile(false);

  const openUserProfile = () => {
    setUserProfile(true);
  };

  const hasMultipleCompanies = useSelector(authSelectors.hasMultipleCompanies);
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);
  const initialColor = useSelector(authSelectors.getAvatarInitialColor);
  const email = useSelector(authSelectors.currentUserEmail);
  const name = useSelector(authSelectors.currentUserName);

  const dispatch = useDispatch();

  /** Handles click on the Switch Company button. */
  const handleSwitchCompany = () => {
    dispatch(authActions.clearNonAuthData());
    dispatch(tableSearchActions.clearAllTables());

    IotService.getInstance().end();
    dispatch(authActions.setCredentials(null));

    FBStore.clearStores();

    history.push(LOGIN_URL);
  };


  const handleLogout = () => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  };

  UserMenuContext = React.createContext<UserMenuContext | undefined>({
    openUserProfile,
    handleLogout,
    hasMultipleCompanies,
    handleSwitchCompany,
  });

  return (
    <NavigationProfilePresenter
      {...{
        email,
        name,
        closeUserProfile,
        showUserProfile,
        avatar,
        initialColor,
        handleOpenMenu,
        handleCloseMenu,
        anchorEl,
      }}
    />
  );
};

export default withRouter(NavigationProfileContainer);

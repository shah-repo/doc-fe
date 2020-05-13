import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { companyActions } from "../../state/ducks/company";
import { ApplicationState } from "../../state/reducers";
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
  useEffect(() => {
    dispatch(companyActions.getCompanyMine());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMultipleCompanies = useSelector((state: ApplicationState) =>
    authSelectors.hasMultipleCompanies(state),
  );
  const avatar = useSelector((state: ApplicationState) =>
    authSelectors.currentEmployeeAvatar(state),
  );
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
      }}
    />
  );
};

export default withRouter(HeaderContainer);

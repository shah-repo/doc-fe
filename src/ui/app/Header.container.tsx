import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { companyActions } from "../../state/ducks/company";
import { CHANGE_REQUEST_CREATE_URL } from "../constants/urls";
import FBStore from "../form.builder/stores/ui/FBStore";
import { Translation } from "../translations/types";
import HeaderPresenter from "./Header.presenter";

type Props = RouteComponentProps;

const HeaderContainer: React.FunctionComponent<Props> = ({
  location,
  history,
}) => {
  const [pageTitle, setPageTitle] = useState<Translation>(
    "translation.unknown",
  );
  const [showUserProfile, setUserProfile] = useState(false);
  const email = useSelector(authSelectors.currentUserEmail);
  const name = useSelector(authSelectors.currentUserName);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(authActions.logout());
    FBStore.clearStores();
  };

  const openUserProfile = () => {
    setUserProfile(true);
  };

  const closeUserProfile = () => setUserProfile(false);
  useEffect(() => {
    setTranslationByPath(location.pathname);
    dispatch(companyActions.getCompanyMine());

    const unlistenHistory = history.listen((location) => {
      setTranslationByPath(location.pathname);
    });

    return () => {
      unlistenHistory();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTranslationByPath = (path: any) => {
    switch (path) {
      case CHANGE_REQUEST_CREATE_URL:
        setPageTitle("page.title.changeRequestCreate");
        break;
      default:
        setPageTitle("translation.unknown");
        break;
    }
  };

  return (
    <HeaderPresenter
      email={email}
      name={name}
      onLogout={logout}
      pageTitle={pageTitle}
      showUserProfile={showUserProfile}
      openUserProfile={openUserProfile}
      closeUserProfile={closeUserProfile}
    />
  );
};

export default withRouter(HeaderContainer);

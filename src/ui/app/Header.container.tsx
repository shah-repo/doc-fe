import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { CHANGE_REQUEST_CREATE_URL } from "../constants/urls";
import { Translation } from "../translations/types";
import HeaderPresenter from "./Header.presenter";
interface StateProps {
  email: string;
  name: string;
}

interface DispatchProps {
  logout: () => void;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const mapStateToProps = (state: ApplicationState) => ({
  email: authSelectors.currentUserEmail(state),
  name: authSelectors.currentUserName(state),
});

const HeaderContainer: React.FunctionComponent<Props> = ({
  email,
  logout,
  name,
  location,
  history,
}) => {
  const [pageTitle, setPageTitle] = useState<Translation>(
    "translation.unknown",
  );
  const [showUserProfile, setUserProfile] = useState(false);

  const openUserProfile = () => {
    setUserProfile(true);
  };

  const closeUserProfile = () => setUserProfile(false);
  useEffect(() => {
    setTranslationByPath(location.pathname);

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

export default connect<StateProps, DispatchProps, {}, ApplicationState>(
  mapStateToProps,
  {
    logout: authActions.logout,
  },
)(withRouter(HeaderContainer));

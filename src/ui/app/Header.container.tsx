import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import HeaderPresenter from "./Header.presenter";
import { withRouter, RouteComponentProps } from "react-router";
import { Translation } from "../translations/types";

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
  let unlistenHistory: any;

  useEffect(() => {
    setTranslationByPath(location.pathname);

    unlistenHistory = history.listen((location) => {
      setTranslationByPath(location.pathname);
    });

    return () => {
      unlistenHistory()
    }
  }, []);

  const setTranslationByPath = (path: any) => {
    switch (path) {
      case "/change_request":
        setPageTitle("page.title.changeRequest");
        break;
      case "/document_revision":
        setPageTitle("page.title.documentList");
        break;
      case "/change_request/create":
        setPageTitle("page.title.changeRequestCreate");
        break;
      case "/document_revision/create":
        setPageTitle("page.title.documentCreate");
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
    />
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(
  mapStateToProps,
  {
    logout: authActions.logout,
  },
)(withRouter(HeaderContainer));

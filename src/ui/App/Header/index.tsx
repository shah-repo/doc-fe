import React from "react";
import { connect } from "react-redux";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import HeaderPresenter from "./Header";

interface StateProps {
  email: string;
}

interface DispatchProps {
  logout: () => void;
}

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: ApplicationState) => ({
  email: authSelectors.currentUserEmail(state),
});

const Header: React.FunctionComponent<Props> = ({ email, logout }) =>
  <HeaderPresenter email={email} onLogout={logout} />;

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  logout: authActions.logout,
})(Header);

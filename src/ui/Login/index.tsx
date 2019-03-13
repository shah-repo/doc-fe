import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { HOME_URL } from "../constants/urls";
import LoginPresenter from "./Login";

interface StateProps {
  isUserAuthenticated: boolean;
}

type Props = StateProps & RouteComponentProps;

const Login: React.FunctionComponent<Props> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };

  if (props.isUserAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <LoginPresenter />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(Login);

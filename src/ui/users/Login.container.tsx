import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";
import { HOME_URL } from "../constants/urls";
import LoginPresenter from "./Login.presenter";
import SwitchCompanyPresenter from "./SwitchCompany/SwitchCompanyPresenter";

interface StateProps {
  isUserAuthenticated: boolean;
  companys: {};
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, "location">;

export const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };

  if (props.isUserAuthenticated) {
    if (Object.keys(props.companys).length > 1) {
      return <SwitchCompanyPresenter />;
    }
    return <Redirect to={from} />;
  }

  return (
    <LoginPresenter />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  companys: authSelectors.companys(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(LoginContainer);

import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { authSelectors } from "../../state/ducks/auth";
import { Employees } from "../../state/ducks/company";
import { ApplicationState } from "../../state/reducers";
import { HOME_URL } from "../constants/urls";
import LoginPresenter from "./Login.presenter";
import SwitchCompany from "./SwitchCompany/SwitchCompany";

interface StateProps {
  isUserAuthenticated: boolean;
  companies: Employees[];
  hasMultipleCompanies: boolean;
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, "location">;

export const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };

  if (props.isUserAuthenticated) {
    if (props.hasMultipleCompanies) {
      return (
        <SwitchCompany
          {...props}
        />
      );
    }
    return <Redirect to={from} />;
  }

  return (
    <LoginPresenter />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  companies: authSelectors.companies(state),
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(LoginContainer);

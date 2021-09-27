import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { logo } from "../../common/utils/helpers";
import { authSelectors } from "../../state/ducks/auth";
import { Employee } from "../../state/ducks/company/types";
import { ApplicationState } from "../../state/reducers";
import { HOME_URL } from "../constants/urls";
import LoginPresenter from "./Login.presenter";
import SwitchCompanyContainer from "./SwitchCompany/SwitchCompany.container";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
  hasMultipleCompanies: boolean;
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, "location">;

export const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };

  if (props.isUserAuthenticated) {
    if (props.hasMultipleCompanies) {
      return (
        <SwitchCompanyContainer
          {...props}
        />
      );
    }
    return <Redirect to={from} />;
  }

  return (
    <LoginPresenter
      logo={logo}
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(LoginContainer);

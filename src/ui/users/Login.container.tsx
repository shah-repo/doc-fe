import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import Config from "../../config";
import { authSelectors } from "../../state/ducks/auth";
import { Employee } from "../../state/ducks/company";
import { ApplicationState } from "../../state/reducers";
import { HOME_URL } from "../constants/urls";
import { ThemeEnv } from "../layout/theme/utils/types";
import LoginPresenter from "./Login.presenter";
import SwitchCompany from "./SwitchCompany/SwitchCompany";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
  hasMultipleCompanies: boolean;
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, "location">;

export const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };
  const theme = Config.Theme;
  const logo = theme === ThemeEnv.DEV_THEME ?
    "/logo_enlil_dark.svg" :
    "/logo_enlil.svg";

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

import React from "react";
import { connect } from "react-redux";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import { logo } from "../../common/utils/helpers";
import { authSelectors } from "../../state/ducks/auth";
import { Employee } from "../../state/ducks/company/types";
import { ApplicationState } from "../../state/reducers";
import { toastInfoLink } from "../components/notifications";
import { HOME_URL, RESET_PASSWORD_URL } from "../constants/urls";
import LoginPresenter from "./Login.presenter";
import SwitchCompanyContainer from "./SwitchCompany/SwitchCompany.container";

interface StateProps {
  isUserAuthenticated: boolean;
  employees: Employee[];
  hasMultipleCompanies: boolean;
  passwordSoonToExpire: boolean;
  daysUntilPasswordExpires: number;
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
    props.passwordSoonToExpire && toastInfoLink(
      <div>
        Your password will expire in {props.daysUntilPasswordExpires} days.
        <Link to={RESET_PASSWORD_URL}>Reset it now.</Link>
      </div>,
      { autoClose: 10000 });
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
  passwordSoonToExpire: authSelectors.getPasswordSoonToExpire(state),
  daysUntilPasswordExpires: authSelectors.getDaysUntilPasswordExpires(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(LoginContainer);

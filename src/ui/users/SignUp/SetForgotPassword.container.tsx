import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import { PasswordValues } from "../types";
import ConfirmPasswordContainer from "./ConfirmPassword.container";

interface StateProps {
  isUserAuthenticated: boolean;
}

interface DispatchProps {
  confirmNewPassword: typeof authActions.confirmNewPassword;
  login: typeof authActions.login;
}

export type SetForgotPasswordContainerProps = StateProps & DispatchProps &
  Pick<RouteComponentProps, "location">;

const SetForgotPasswordContainer: React.FunctionComponent<SetForgotPasswordContainerProps> = ({
  confirmNewPassword,
  location,
  isUserAuthenticated,
}) => {
  const parsedLocation = parse(location.search);
  const clientCode = parsedLocation.code;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const async = useAsync();

  const onSubmit = (confirmValues: PasswordValues): void => {
    async.start(
      confirmNewPassword,
      {
        email: confirmValues.email,
        code: clientCode as string,
        password: confirmValues.password,
      },
      async,
    );
  };

  return (
    <ConfirmPasswordContainer
      clientEmail={clientEmail}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      isUserAuthenticated={isUserAuthenticated}
      title="forgot.password.confirm"
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<{}, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  confirmNewPassword: authActions.confirmNewPassword,
  login: authActions.login,
})(SetForgotPasswordContainer);

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
  newUserSetPassword: typeof authActions.newUserSetPassword;
  login: typeof authActions.login;
}

export type NewUserSetPasswordContainerProps = StateProps & DispatchProps &
  Pick<RouteComponentProps, "location">;

const NewUserSetPasswordContainer: React.FunctionComponent<NewUserSetPasswordContainerProps> = ({
  newUserSetPassword,
  location,
  isUserAuthenticated,
}) => {
  const parsedLocation = parse(location.search);
  const tempPass = parsedLocation.tempPass;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const async = useAsync();

  const onSubmit = (confirmValues: PasswordValues): void => {
    async.start(
      newUserSetPassword,
      {
        email: confirmValues.email,
        newPassword: confirmValues.password,
        oldPassword: tempPass as string,
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
      title="new.user.set.password"
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<{}, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  newUserSetPassword: authActions.newUserSetPassword,
  login: authActions.login,
})(NewUserSetPasswordContainer);

import { parse } from "query-string";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import useAsync from "../../hooks/useAsync";
import { PasswordValues } from "../types";
import ConfirmPasswordContainer from "./ConfirmPassword.container";

type SetForgotPasswordContainerProps = Pick<RouteComponentProps, "location">;

const SetForgotPasswordContainer: React.FunctionComponent<SetForgotPasswordContainerProps> = ({
  location,
}) => {
  const dispatch = useDispatch();
  const isUserAuth = useSelector(authSelectors.isAuthenticated);
  const parsedLocation = parse(location.search);
  const clientCode = parsedLocation.code;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const async = useAsync();

  const onSubmit = (confirmValues: PasswordValues): void => {
    dispatch(
      authActions.confirmNewPassword(
        {
          email: confirmValues.email,
          code: clientCode as string,
          password: confirmValues.password,
        },
        async,
      ),
    );
  };

  return (
    <ConfirmPasswordContainer
      clientEmail={clientEmail}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      isUserAuthenticated={isUserAuth}
      title="forgot.password.confirm"
    />
  );
};

export default SetForgotPasswordContainer;

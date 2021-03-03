import { parse } from "query-string";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import useAsync from "../../hooks/useAsync";
import { PasswordValues } from "../types";
import ConfirmPasswordContainer from "./ConfirmPassword.container";

type NewUserSetPasswordContainerProps = Pick<RouteComponentProps, "location">;

const NewUserSetPasswordContainer: React.FunctionComponent<NewUserSetPasswordContainerProps> = ({
  location,
}) => {
  const dispatch = useDispatch();
  const isUserAuth = useSelector(authSelectors.isAuthenticated);
  const parsedLocation = parse(location.search);
  const tempPass = parsedLocation.tempPass;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const async = useAsync();

  const onSubmit = (confirmValues: PasswordValues): void => {
    dispatch(
      authActions.newUserSetPassword({
        email: confirmValues.email,
        newPassword: confirmValues.password,
        oldPassword: tempPass as string,
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
      title="new.user.set.password"
    />
  );
};

export default NewUserSetPasswordContainer;

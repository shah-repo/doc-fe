import * as React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { authSelectors } from "../../../state/ducks/auth";
import { RESET_PASSWORD_SUCCESSFUL_URL } from "../../constants/urls";
import useAsync from "../../hooks/useAsync";
import { PasswordValues } from "../types";
import ResetPasswordContainer from "./ResetPassword.container";

type Props = Pick<RouteComponentProps, "location">;

const ResetPassword: React.FunctionComponent<Props> = ({
  location,
}) => {
  const isUserAuth = useSelector(authSelectors.isAuthenticated);
  const clientEmail = useSelector(authSelectors.currentUserEmail);
  const history = useHistory();

  const async = useAsync({
    onSuccess: () => history.push(RESET_PASSWORD_SUCCESSFUL_URL),
  });

  const onSubmit = (confirmValues: PasswordValues): void => history.push(RESET_PASSWORD_SUCCESSFUL_URL);

  return (
    <ResetPasswordContainer
      clientEmail={clientEmail}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      isUserAuthenticated={isUserAuth}
    />
  );
};

export default ResetPassword;

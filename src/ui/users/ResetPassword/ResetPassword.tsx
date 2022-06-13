import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps, useHistory } from "react-router-dom";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { HOME_URL, RESET_PASSWORD_SUCCESSFUL_URL } from "../../constants/urls";
import FBStore from "../../form.builder/stores/ui/FBStore";
import useAsync from "../../hooks/useAsync";
import { ResetPasswordValues } from "../types";
import ResetPasswordContainer from "./ResetPassword.container";

type Props = Pick<RouteComponentProps, "location">;

const ResetPassword: React.FunctionComponent<Props> = ({
  location,
}) => {
  const isUserAuth = useSelector(authSelectors.isAuthenticated);
  const history = useHistory();
  const dispatch = useDispatch();

  const async = useAsync({
    onSuccess: () => {
      dispatch(authActions.logout());
      FBStore.clearStores();
      history.push(RESET_PASSWORD_SUCCESSFUL_URL);
    },
  });

  const onSubmit = (values: ResetPasswordValues): void => {
    dispatch(
      authActions.resetPassword({
        email: values.email,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newPasswordConfirmation: values.newPasswordConfirmation,
      },
      async,
      ),
    );
  };

  if (!isUserAuth) {
    return <Redirect to={{ pathname: HOME_URL }} />;
  }

  return (
    <ResetPasswordContainer
      onSubmit={onSubmit}
      asyncState={async.asyncState}
    />
  );
};

export default ResetPassword;

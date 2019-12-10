import { Formik, FormikProps } from "formik";
import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import Config from "../../../config";
import { authActions } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import {
  confirmPasswordSchema,
  passwordSchema,
} from "../../components/forms/fields/validators";
import { HOME_URL } from "../../constants/urls";
import useAsync from "../../hooks/useAsync";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { ForgotPasswordValues } from "../types";
import ConfirmForgotPasswordPresenter from "./ConfirmForgotPassword.presenter";

interface DispatchProps {
  confirmNewPassword: typeof authActions.confirmNewPassword;
  login: typeof authActions.login;
}

export type ConfirmForgotPasswordContainerProps = DispatchProps &
  Pick<RouteComponentProps, "location">;

const ConfirmForgotPasswordContainer: React.FunctionComponent<ConfirmForgotPasswordContainerProps> = ({
  confirmNewPassword,
  location,
  login,
}) => {
  const parsedLocation = parse(location.search);
  const clientCode = parsedLocation.code;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const theme = Config.Theme;
  const logo =
    theme === ThemeEnv.DEV_THEME ? "/logo_enlil_dark.svg" : "/logo_enlil.svg";

  const async = useAsync({
    onSuccess: () => {
      isLoggedIn(true);
    },
  });

  const [logged, isLoggedIn] = React.useState(false);

  const onSubmit = (confirmValues: ForgotPasswordValues): void => {
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

  const initialValues: ForgotPasswordValues = {
    email: clientEmail,
    confirmPass: "",
    password: "",
  };

  const render = (props: FormikProps<ForgotPasswordValues>) => (
    <ConfirmForgotPasswordPresenter logo={logo} asyncState={async.asyncState} />
  );
  const validationSchema = Yup.object({
    password: passwordSchema,
    confirmPass: confirmPasswordSchema,
  });

  return (
    <div>
      {logged && <Redirect to={{ pathname: HOME_URL }} />}}
      {!logged && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          render={render}
        />
      )}
    </div>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  confirmNewPassword: authActions.confirmNewPassword,
  login: authActions.login,
})(ConfirmForgotPasswordContainer);

import { Formik, FormikProps } from "formik";
import * as React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import Config from "../../../config";
import { authActions } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { Translation } from "../../translations/types";
import ForgotPasswordPage from "../SignUp/ForgotPasswordPage";
import VerificationEmailPage from "../SignUp/VerificationEmailPage";
import { LoginFormValues } from "../types";
import LoginFormPresenter from "./LoginForm.presenter";

interface DispatchProps {
  login: typeof authActions.login;
}
interface Props {
  signMessage: Translation;
  signLabel: Translation;
  route: string;
  title: Translation;
}

type LoginFormContainerProps = DispatchProps & Props;

const LoginFormContainer: React.FunctionComponent<LoginFormContainerProps> = ({
  login,
  signMessage,
  route,
  signLabel,
  title,
}) => {
  const async = useAsync();

  const onSubmit = (values: LoginFormValues): void => {
    async.start(login, values, async);
  };

  const [verificationState, showVerificationState] = React.useState(false);
  const [signupEmail, saveSignupEmail] = React.useState("");
  const [message, saveMessage] = React.useState("");
  const [forgotPassword, showForgotPasswordState] = React.useState(false);

  const theme = Config.Theme;
  const logo = theme === ThemeEnv.DEV_THEME ?
    "/logo_enlil_dark.svg" :
    "/logo_enlil.svg";

  const handleVerificationState = (values: LoginFormValues, message: string | Translation): void => {
    saveSignupEmail(values.email);
    saveMessage(message);
    showForgotPasswordState(false);
    showVerificationState(true);
  };

  const handleForgotPassword = (): void => {
    showForgotPasswordState(true);
  };

  const handleCloseForgotPassword = (): void => {
    showForgotPasswordState(false);
  };

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const render = (props: FormikProps<LoginFormValues>) => (
    <LoginFormPresenter
      {...props}
      asyncState={async.asyncState}
      signMessage={signMessage}
      route={route}
      signLabel={signLabel}
      showVerificationState={handleVerificationState}
      title={title}
      logo={logo}
      forgotPassword={handleForgotPassword}
    />
  );

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("Required")
      .matches(/(?=.*?[A-Z])/, "Password must contain an upper case letter")
      .matches(/(?=.*?[a-z])/, "Password must contain a lower case letter")
      .matches(/(?=.*?[0-9])/, "Password must contain a number")
      .matches(/(?=.*?[^\w\s])/, "Password must contain a special characters"),
  });

  const renderForgotPassword = (props: FormikProps<LoginFormValues>) => (
    <ForgotPasswordPage
      {...props}
      logo={logo}
      closeForgotPasswordPage={handleCloseForgotPassword}
      asyncState={async.asyncState}
      showVerificationState={handleVerificationState}
    />
  );

  return (
    <div>
      {forgotPassword &&
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={renderForgotPassword}
        />}
      {verificationState && !forgotPassword &&
        <VerificationEmailPage
          email={signupEmail}
          message={message}
          logo={logo}
          isForgotPassword={message === "forgot.password.email"}
        />}
      {!verificationState && !forgotPassword && <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={signLabel === "login.title" ? SignupSchema : null}
        render={render}
      />}
    </div>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  login: authActions.login,
})(LoginFormContainer);

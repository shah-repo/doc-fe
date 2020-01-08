import { Formik, FormikProps } from "formik";
import * as React from "react";
import { connect } from "react-redux";
import { logo } from "../../../common/utils/helpers";
import { authActions } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import ForgotPasswordPage from "../SignUp/ForgotPasswordPage";
import VerificationEmailPage from "../SignUp/VerificationEmailPage";
import { ForgotPasswordEmail, LoginFormValues } from "../types";
import LoginFormPresenter from "./LoginForm.presenter";

interface DispatchProps {
  login: typeof authActions.login;
  forgotPassword: typeof authActions.forgotPassword;
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
  forgotPassword,
  signMessage,
  route,
  signLabel,
  title,
}) => {
  const async = useAsync();

  const forgotPassAsync = useAsync({
    onSuccess: () => {
      showVerificationState(true);
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    async.start(login, values, async);
  };

  const onForgotPassword = (email: ForgotPasswordEmail): void => {
    forgotPassAsync.start(forgotPassword, email, forgotPassAsync);
  };

  const [verificationState, showVerificationState] = React.useState(false);
  const [resetEmail, saveResetEmail] = React.useState("");
  const [message, saveMessage] = React.useState("");
  const [forgotPasswordPage, showForgotPasswordState] = React.useState(false);

  const handleVerificationState = (values: any, message: string | Translation): void => {
    saveResetEmail(values.email);
    saveMessage(message);
    forgotPassAsync.start(forgotPassword, {email: values.email}, forgotPassAsync);
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

  const resetInitialValues: ForgotPasswordEmail = {
    email: "",
  };

  const render = (props: FormikProps<LoginFormValues>) => (
    <LoginFormPresenter
      {...props}
      asyncState={async.asyncState}
      signMessage={signMessage}
      route={route}
      signLabel={signLabel}
      title={title}
      logo={logo}
      forgotPassword={handleForgotPassword}
      buttonLabel={"login.submit"}
    />
  );

  const renderForgotPassword = (props: FormikProps<ForgotPasswordEmail>) => (
    <ForgotPasswordPage
      {...props}
      logo={logo}
      closeForgotPasswordPage={handleCloseForgotPassword}
      asyncState={forgotPassAsync.asyncState}
      showVerificationState={handleVerificationState}
    />
  );

  return (
    <div>
      {forgotPasswordPage && !verificationState && (
        <Formik
          initialValues={resetInitialValues}
          onSubmit={onForgotPassword}
        >
          {renderForgotPassword}
        </Formik>
      )}
      {verificationState && (
        <VerificationEmailPage
          email={resetEmail}
          message={message}
          logo={logo}
          isForgotPassword={true}
        />
      )}
      {!forgotPasswordPage && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {render}
        </Formik>
      )}
    </div>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  login: authActions.login,
  forgotPassword: authActions.forgotPassword,
})(LoginFormContainer);

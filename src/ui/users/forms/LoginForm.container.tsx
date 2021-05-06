import { Formik, FormikProps } from "formik";
import * as React from "react";
import { logo } from "../../../common/utils/helpers";
import { authActions } from "../../../state/ducks/auth";
import { FormContext } from "../../components/forms/FormContext";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import ForgotPasswordPage from "../SignUp/ForgotPasswordPage";
import VerificationEmailPage from "../SignUp/VerificationEmailPage";
import { LoginFormValues, PasswordEmail } from "../types";
import LoginFormPresenter from "./LoginForm.presenter";

interface Props {
  signMessage: Translation;
  signLabel: Translation;
  route: string;
  title: Translation;
}

const LoginFormContainer: React.FunctionComponent<Props> = ({
  signMessage,
  route,
  signLabel,
  title,
}) => {
  const async = useAsync();
  const loginAction = useActionCreator(authActions.login);
  const forgotPasswordAction = useActionCreator(authActions.forgotPassword);

  const forgotPassAsync = useAsync({
    onSuccess: () => {
      showVerificationState(true);
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    async.start(loginAction, values, async);
  };

  const onForgotPassword = (email: PasswordEmail): void => {
    forgotPassAsync.start(forgotPasswordAction, email, forgotPassAsync);
  };

  const [verificationState, showVerificationState] = React.useState(false);
  const [resetEmail, saveResetEmail] = React.useState("");
  const [message, saveMessage] = React.useState("");
  const [forgotPasswordPage, showForgotPasswordState] = React.useState(false);

  const handleVerificationState = (
    values: any,
    message: string | Translation,
  ): void => {
    saveResetEmail(values.email);
    saveMessage(message);
    forgotPassAsync.start(
      forgotPasswordAction,
      { email: values.email },
      forgotPassAsync,
    );
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

  const resetInitialValues: PasswordEmail = {
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

  const renderForgotPassword = (props: FormikProps<PasswordEmail>) => (
    <ForgotPasswordPage
      {...props}
      logo={logo}
      closeForgotPasswordPage={handleCloseForgotPassword}
      asyncState={forgotPassAsync.asyncState}
      showVerificationState={handleVerificationState}
    />
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <div>
        {forgotPasswordPage && !verificationState && (
          <Formik initialValues={resetInitialValues} onSubmit={onForgotPassword}>
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
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {render}
          </Formik>
        )}
      </div>
    </FormContext.Provider>
  );
};

export default LoginFormContainer;

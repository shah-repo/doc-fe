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
import VerificationEmailPage from "../SignUp/VerificationEmailPage";
import { LoginFormValues } from "../types";
import LoginFormPresenter from "./LoginForm.presenter";

interface DispatchProps {
  signup: typeof authActions.signup;
}
interface Props {
  signMessage: Translation;
  signLabel: Translation;
  route: string;
  title: Translation;
}

type SignupFormContainerProps = DispatchProps & Props;

const SignupFormContainer: React.FunctionComponent<SignupFormContainerProps> = ({
  signup,
  signMessage,
  route,
  signLabel,
  title,
}) => {
  const async = useAsync({
    onSuccess: () => {
        toggleSignupSuccess(true);
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    async.start(signup, values, async);
  };

  const [signupEmail, saveSignupEmail] = React.useState("");
  const [message, saveMessage] = React.useState("");
  const [signupSuccess, toggleSignupSuccess] = React.useState(false);

  const theme = Config.Theme;
  const logo = theme === ThemeEnv.DEV_THEME ?
    "/logo_enlil_dark.svg" :
    "/logo_enlil.svg";

  const handleVerificationState = (values: LoginFormValues, message: string | Translation): void => {
    saveSignupEmail(values.email);
    saveMessage(message);
    async.start(signup, values, async);
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

  return (
    <div>
      {signupSuccess &&
        <VerificationEmailPage
          email={signupEmail}
          message={message}
          logo={logo}
          isForgotPassword={false}
        />}
       {!signupSuccess && <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={SignupSchema}
        render={render}
       />}
    </div>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  signup: authActions.signup,
})(SignupFormContainer);

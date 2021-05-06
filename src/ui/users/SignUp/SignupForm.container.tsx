import { Formik, FormikProps } from "formik";
import * as React from "react";
import * as Yup from "yup";
import { logo } from "../../../common/utils/helpers";
import { authActions } from "../../../state/ducks/auth";
import { emailSchema, passwordSchema } from "../../components/forms/fields/validators";
import { FormContext } from "../../components/forms/FormContext";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import LoginFormPresenter from "../forms/LoginForm.presenter";
import { LoginFormValues } from "../types";
import VerificationEmailPage from "./VerificationEmailPage";

interface Props {
  signMessage: Translation;
  signLabel: Translation;
  route: string;
  title: Translation;
}

const SignupFormContainer: React.FunctionComponent<Props> = ({
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

  const [signupEmail, saveSignupEmail] = React.useState("");
  const [message, saveMessage] = React.useState("");
  const [signupSuccess, toggleSignupSuccess] = React.useState(false);
  const signupAction = useActionCreator(authActions.signup);

  const handleVerificationState = (values: LoginFormValues): void => {
    saveSignupEmail(values.email);
    saveMessage(message);
    async.start(signupAction, values, async);
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
      title={title}
      logo={logo}
      buttonLabel={"signup.submit"}
    />
  );

  const SignupSchema = Yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
  });

  return (
    <div>
      {signupSuccess &&
        <VerificationEmailPage
          email={signupEmail}
          message={"signup.verification.message"}
          logo={logo}
          isForgotPassword={false}
        />}
      {
        !signupSuccess &&
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleVerificationState}
            validationSchema={SignupSchema}
          >
            {render}
          </Formik>
        </FormContext.Provider>
      }
    </div>
  );
};

export default SignupFormContainer;

import { Formik, FormikProps } from "formik";
import * as React from "react";
import { connect } from "react-redux";
import * as Yup from 'yup';
import { authActions } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import { Translation } from "../../translations/types";
import { LoginFormValues } from "../types";
import LoginFormPresenter from "./LoginForm.presenter";

interface DispatchProps {
  login: typeof authActions.login;
}
interface Props {
  buttonLabel: Translation;
  signMessage: Translation;
  signLabel: Translation;
  route: string;
}

type LoginFormContainerProps = DispatchProps & Props;

const LoginFormContainer: React.FunctionComponent<LoginFormContainerProps> = ({
  login,
  buttonLabel,
  signMessage,
  route,
  signLabel,
}) => {
  const async = useAsync();

  const onSubmit = (values: LoginFormValues): void => {
    async.start(login, values, async);
  };

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const render = (props: FormikProps<LoginFormValues>) => (
    <LoginFormPresenter
      {...props}
      asyncState={async.asyncState}
      buttonLabel={buttonLabel}
      signMessage={signMessage}
      route={route}
      signLabel={signLabel}
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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={signLabel === "login.button" ? SignupSchema : null}
      render={render}
    />
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  login: authActions.login,
})(LoginFormContainer);

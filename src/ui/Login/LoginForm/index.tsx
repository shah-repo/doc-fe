import { Formik, FormikActions, FormikConfig, FormikProps, FormikValues } from "formik";
import * as React from "react";
import { connect } from "react-redux";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import { LoginFormValues } from "../types";
import LoginFormPresenter from "./LoginForm";

interface StateProps {
  asyncStatus: AsyncState;
}

interface DispatchProps {
  login: typeof authActions.login;
}

type Props = DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  asyncStatus: authSelectors.loginFormAsyncStatus(state),
});

const LoginForm: React.FunctionComponent<Props> = ({ asyncStatus, login }) => {
  const onSubmit = (values: LoginFormValues, actions: FormikActions<LoginFormValues>): void => {
    actions.setSubmitting(false);
    login(values);
  };

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const render = (props: FormikProps<LoginFormValues>) => (
    <LoginFormPresenter {...props} asyncState={asyncStatus} />
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={render}
    />
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  login: authActions.login,
})(LoginForm);

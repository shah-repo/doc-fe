import { Formik, FormikProps } from "formik";
import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import { logo } from "../../../common/utils/helpers";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { ApplicationState } from "../../../state/reducers";
import {
  confirmPasswordSchema,
  passwordSchema,
} from "../../components/forms/fields/validators";
import { HOME_URL } from "../../constants/urls";
import useAsync from "../../hooks/useAsync";
import { ForgotPasswordValues } from "../types";
import ConfirmForgotPasswordPresenter from "./ConfirmForgotPassword.presenter";

interface DispatchProps {
  confirmNewPassword: typeof authActions.confirmNewPassword;
  login: typeof authActions.login;
}

interface StateProps {
  isUserAuthenticated: boolean;
}

export type ConfirmForgotPasswordContainerProps = DispatchProps & StateProps &
  Pick<RouteComponentProps, "location">;

const ConfirmForgotPasswordContainer: React.FunctionComponent<ConfirmForgotPasswordContainerProps> = ({
  confirmNewPassword,
  location,
  isUserAuthenticated,
}) => {
  const parsedLocation = parse(location.search);
  const clientCode = parsedLocation.code;
  const clientEmail = (parsedLocation.email as string).split(" ").join("+");

  const async = useAsync();

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
      {isUserAuthenticated && <Redirect to={{ pathname: HOME_URL }} />}}
      {!isUserAuthenticated && (
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

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
});

export default connect<{}, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  confirmNewPassword: authActions.confirmNewPassword,
  login: authActions.login,
})(ConfirmForgotPasswordContainer);

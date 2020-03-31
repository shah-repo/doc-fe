import { Formik, FormikProps } from "formik";
import * as React from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { logo } from "../../../common/utils/helpers";
import { AsyncState } from "../../../state/types";
import { confirmPasswordSchema, passwordSchema } from "../../components/forms/fields/validators";
import { LOGIN_URL } from "../../constants/urls";
import { Translation } from "../../translations/types";
import { PasswordValues } from "../types";
import ConfirmPasswordPresenter from "./ConfirmPassword.presenter";

interface Props {
  clientEmail: string;
  asyncState: AsyncState;
  onSubmit: (confirmValues: PasswordValues) => void;
  isUserAuthenticated: boolean;
  title: Translation;
}

const ConfirmPasswordContainer: React.FunctionComponent<Props> = ({
  isUserAuthenticated,
  clientEmail,
  asyncState,
  onSubmit,
  title,
}) => {

  const initialValues: PasswordValues = {
    email: clientEmail,
    confirmPass: "",
    password: "",
  };

  const render = (props: FormikProps<PasswordValues>) => (
    <ConfirmPasswordPresenter
      logo={logo}
      asyncState={asyncState}
      title={title}
    />
  );

  const validationSchema = Yup.object({
    password: passwordSchema,
    confirmPass: confirmPasswordSchema,
  });

  return (
    <div>
      {isUserAuthenticated && <Redirect to={{ pathname: LOGIN_URL }} />}
      {!isUserAuthenticated && (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {render}
        </Formik>
      )}
    </div>
  );
};

export default ConfirmPasswordContainer;

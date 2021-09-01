import { Formik, FormikProps } from "formik";
import * as React from "react";
import * as Yup from "yup";
import { logo } from "../../../common/utils/helpers";
import { AsyncState } from "../../../state/types";
import { confirmPasswordSchema, passwordSchema } from "../../components/forms/fields/validators";
import { FormContext } from "../../components/forms/FormContext";
import { PasswordValues } from "../types";
import ResetPasswordPresenter from "./ResetPassword.presenter";

interface Props {
  clientEmail: string;
  asyncState: AsyncState;
  onSubmit: (confirmValues: PasswordValues) => void;
  isUserAuthenticated: boolean;
}

const ResetPasswordContainer: React.FunctionComponent<Props> = ({
  clientEmail,
  asyncState,
  onSubmit,
}) => {

  const initialValues: PasswordValues = {
    email: clientEmail,
    confirmPass: "",
    password: "",
  };

  const render = (props: FormikProps<PasswordValues>) => (
    <ResetPasswordPresenter
      logo={logo}
      asyncState={asyncState}
    />
  );

  const validationSchema = Yup.object({
    password: passwordSchema,
    confirmPass: confirmPasswordSchema,
  });

  return (
    <div>
      {(
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {render}
          </Formik>
        </FormContext.Provider>
      )}
    </div>
  );
};

export default ResetPasswordContainer;

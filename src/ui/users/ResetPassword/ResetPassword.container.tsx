import { Formik, FormikProps } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { logo } from '../../../common/utils/helpers';
import { AsyncState } from '../../../state/types';
import { confirmResetPasswordSchema, emailSchema, passwordSchema, requiredSchema } from '../../components/forms/fields/validators';
import { FormContext } from '../../components/forms/FormContext';
import { ResetPasswordValues } from '../types';
import ResetPasswordPresenter from './ResetPassword.presenter';

interface Props {
  asyncState: AsyncState;
  onSubmit: (confirmValues: ResetPasswordValues) => void;
}

const ResetPasswordContainer: React.FunctionComponent<Props> = ({
  asyncState,
  onSubmit,
}) => {

  const initialValues: ResetPasswordValues = {
    email: '',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  };

  const render = (props: FormikProps<ResetPasswordValues>) => (
    <ResetPasswordPresenter
      logo={logo}
      asyncState={asyncState}
    />
  );

  const validationSchema = Yup.object({
    email: emailSchema,
    currentPassword: requiredSchema,
    newPassword: passwordSchema,
    newPasswordConfirmation: confirmResetPasswordSchema,
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

import { Formik, FormikProps } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { logo } from '../../../common/utils/helpers';
import { AsyncState } from '../../../state/types';
import { confirmResetPasswordSchema, requiredSchema } from '../../components/forms/fields/validators';
import { ResetPasswordValues } from '../types';
import ResetPasswordPresenter from './ResetPassword.presenter';

const initialValues: ResetPasswordValues = {
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

interface Props {
  asyncState: AsyncState
  onSubmit: (confirmValues: ResetPasswordValues) => void
}

const ResetPasswordContainer: React.FC<Props> = ({
  asyncState,
  onSubmit,
}) => {
  const render = (props: FormikProps<ResetPasswordValues>) => (
    <ResetPasswordPresenter
      logo={logo}
      asyncState={asyncState}
    />
  );

  const validationSchema = Yup.object({
    currentPassword: requiredSchema,
    newPassword: requiredSchema,
    newPasswordConfirmation: confirmResetPasswordSchema,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {render}
    </Formik>
  );
};

export default ResetPasswordContainer;

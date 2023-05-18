import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { authActions } from '../../../state/ducks/auth';
import { RESET_PASSWORD_SUCCESSFUL_URL } from '../../constants/urls';
import FBStore from '../../form.builder/stores/ui/FBStore';
import useAsync from '../../hooks/useAsync';
import { ResetPasswordValues } from '../types';
import ResetPasswordContainer from './ResetPassword.container';

type Props = Pick<RouteComponentProps, 'location'>;

const ResetPassword: React.FunctionComponent<Props> = ({
  location,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const async = useAsync({
    onSuccess: () => {
      dispatch(authActions.logout());
      FBStore.clearStores();
      history.push(RESET_PASSWORD_SUCCESSFUL_URL);
    },
  });

  const onSubmit = (values: ResetPasswordValues): void => {
    dispatch(
      authActions.resetPassword({
        email: values.email,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newPasswordConfirmation: values.newPasswordConfirmation,
      },
      async,
      ),
    );
  };

  return (
    <ResetPasswordContainer
      onSubmit={onSubmit}
      asyncState={async.asyncState}
    />
  );
};

export default ResetPassword;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { authActions, authSelectors } from '../../../state/ducks/auth';
import { RESET_PASSWORD_SUCCESSFUL_URL } from '../../constants/urls';
import FBStore from '../../form.builder/stores/ui/FBStore';
import useAsync from '../../hooks/useAsync';
import { ResetPasswordValues } from '../types';
import ResetPasswordContainer from './ResetPassword.container';

type Props = Pick<RouteComponentProps, 'history'>;

const ResetPassword: React.FC<Props> = ({
  history,
}) => {
  const dispatch = useDispatch();
  const isUserAuthenticated = useSelector(authSelectors.isAuthenticated);

  const async = useAsync({
    onSuccess: () => {
      FBStore.clearStores();
      dispatch(authActions.logout());
      history.push(RESET_PASSWORD_SUCCESSFUL_URL);
    },
  });

  if (!isUserAuthenticated) {
    history.replace('/');
  }

  const onSubmit = (values: ResetPasswordValues) => dispatch(
    authActions.resetPassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newPasswordConfirmation: values.newPasswordConfirmation,
      },
      async,
    ),
  );

  return (
    <ResetPasswordContainer
      onSubmit={onSubmit}
      asyncState={async.asyncState}
    />
  );
};

export default ResetPassword;

import { Link } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { useIntl } from 'react-intl';
import { authActions } from '../../../../state/ducks/auth';
import { GetEmployeeResponse } from '../../../../state/ducks/userManagement/types';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { toastInfo } from '../../../components/notifications';
import Text from '../../../components/Text';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { styles } from './styles';

export const SignedCell = ({
  rowType,
  dataItem,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const classes = styles();
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const getResendSignupEmailAction = useActionCreator(
    authActions.resendSignupEmail,
  );
  const getSendPasswordResetEmailAction = useActionCreator(
    authActions.sendPasswordResetEmail,
  );

  const asyncSignUpEmail = useAsync({
    onSuccess: () => {
      toastInfo(getTranslatedText('user.management.signup.email.sent'));
    },
  });

  const asyncResetPasswordEmail = useAsync({
    onSuccess: () => {
      toastInfo(getTranslatedText('user.management.reset.password.email.sent'));
    },
  });

  const handleResendEmail = ({ user, id }: GetEmployeeResponse) => {
    !user?.confirmed
      ? asyncSignUpEmail.start(
        getResendSignupEmailAction,
          user?.email,
          asyncSignUpEmail,
      )
      : asyncResetPasswordEmail.start(
        getSendPasswordResetEmailAction,
        id,
        asyncResetPasswordEmail,
      );
  };

  if (rowType === 'groupHeader') {
    return null;
  }
  const getChildrenElement = (
    <span>
      {dataItem?.user?.confirmed && !dataItem?.user?.locked ? (
        <Text translation="user.management.signed.up" />
      ) : (
        <Link
          component="button"
          variant="body2"
          onClick={() => handleResendEmail(dataItem)}
        >
          <span className={classes.link}>
            <Text translation={!dataItem?.user?.confirmed
              ? 'user.management.resend.signup.email'
              : 'reset.password'
            } />
          </span>
        </Link>
      )}
    </span>
  );
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {!dataItem.inEdit && (
        <Tooltip
          data={
            dataItem?.user?.confirmed && !dataItem?.user?.locked
              ? getTranslatedText('user.management.signed.up')
              : !dataItem?.user?.confirmed ? getTranslatedText('user.management.resend.signup.email')
                : getTranslatedText('reset.password')
          }
          childrenElement={getChildrenElement}
        />
      )}
    </td>
  );
};

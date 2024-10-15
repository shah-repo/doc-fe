import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Tooltip } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../common/intl';
import { authActions } from '../../../../state/ducks/auth';
import { toastError, toastInfo } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useStyles from './styles';

export const SignedCell = ({
  rowType,
  dataItem,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps): React.ReactElement | null => {
  const classes = useStyles();
  const getResendSignupEmailAction = useActionCreator(
    authActions.resendSignupEmail,
  );
  const getSendPasswordResetEmailAction = useActionCreator(
    authActions.sendPasswordResetEmail,
  );

  const asyncSignUpEmail = useAsync({
    onSuccess: () => {
      toastInfo(translate('user.management.signup.email.sent'));
    },
    onError: toastError,
  });

  const asyncResetPasswordEmail = useAsync({
    onSuccess: () => {
      toastInfo(translate('user.management.reset.password.email.sent'));
    },
    onError: toastError,
  });

  if (rowType === 'groupHeader') {
    return null;
  }

  const isLocked = Boolean(dataItem.user?.locked);
  const isConfirmed = Boolean(dataItem.user?.confirmed);

  const linkMessage = isConfirmed ? 'reset.password' : 'user.management.resend.signup.email';
  const linkText = translate(linkMessage);
  const statusMessage = isLocked ? 'user.locked' : isConfirmed ? 'user.confirmed' : 'user.unconfirmed';
  const statusText = translate(statusMessage);

  const sendEmail = () => {
    if (isConfirmed) {
      asyncResetPasswordEmail.start(
        getSendPasswordResetEmailAction,
        dataItem.id,
        asyncResetPasswordEmail,
      );
      return;
    }
    asyncSignUpEmail.start(
      getResendSignupEmailAction,
      dataItem.user?.email,
      asyncSignUpEmail,
    );
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {!dataItem.inEdit && (
        <div className={classes.statusContainer}>
          <Tooltip title={statusText}>
            <FontAwesomeIcon
              className={cx(classes.statusIcon, {
                [classes.confirmedIcon]: isConfirmed,
                [classes.unconfirmedIcon]: !isConfirmed,
                [classes.lockedIcon]: isLocked,
              })}
              icon={
                isLocked
                  ? solid('circle-exclamation')
                  : isConfirmed
                    ? solid('circle-check')
                    : solid('circle-ellipsis')
              }
            />
          </Tooltip>
          <Link
            component="button"
            variant="body2"
            onClick={sendEmail}
          >
            <span className={classes.link}>{linkText}</span>
          </Link>
        </div>
      )}
    </td>
  );
};

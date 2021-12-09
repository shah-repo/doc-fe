import React from "react";
import { useIntl } from "react-intl";
import { authActions } from "../../../../state/ducks/auth";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement/types";
import { toastInfo } from "../../../components/notifications";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";

export const SignedCell = (props) => {
  const signed = props.dataItem.user.confirmed;
  const intl = useIntl();
  const getResendSignupEmailAction = useActionCreator(
    authActions.resendSignupEmail
  );
  const getSendPasswordResetEmailAction = useActionCreator(
    authActions.sendPasswordResetEmail
  );

  const asyncSignUpEmail = useAsync({
    onSuccess: () => {
      toastInfo(
        intl.formatMessage({
          id: "user.management.signup.email.sent",
        })
      );
    },
  });

  const asyncResetPasswordEmail = useAsync({
    onSuccess: () => {
      toastInfo(
        intl.formatMessage({
          id: "user.management.reset.password.email.sent",
        })
      );
    },
  });

  const handleResendEmail = (employee: GetEmployeeResponse) => {
    const { user, id } = employee || {};
    user?.locked
      ? asyncResetPasswordEmail.start(
        getSendPasswordResetEmailAction,
        id,
        asyncResetPasswordEmail
      )
      : asyncSignUpEmail.start(
        getResendSignupEmailAction,
          user?.email,
          asyncSignUpEmail
      );
  };

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <span>
        {signed ? (
          "Signed up"
        ) : (
          <button
            className="k-button k-primary"
            onClick={() => handleResendEmail(props.dataItem)}
          >{`Resend signup email`}</button>
        )}
      </span>
    </td>
  );
};

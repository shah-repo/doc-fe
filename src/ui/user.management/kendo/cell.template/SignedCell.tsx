import Link from "@material-ui/core/Link";
import React from "react";
import { useIntl } from "react-intl";
import { authActions } from "../../../../state/ducks/auth";
import { GetEmployeeResponse } from "../../../../state/ducks/userManagement/types";
import { toastInfo } from "../../../components/notifications";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import KendoGridStyles from "../styles";

export const SignedCell = (props) => {
  const classes = KendoGridStyles();
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

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {!props.dataItem.inEdit && (
        <span>
          {props.dataItem?.user?.confirmed ? (
            "Signed up"
          ) : (
            <Link
              component="button"
              variant="body2"
              onClick={() => handleResendEmail(props.dataItem)}
            >
              <span className={classes.link}>Resend signup email</span>
            </Link>
          )}
        </span>
      )}
    </td>
  );
};

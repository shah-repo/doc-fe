import { ButtonProps } from "@material-ui/core/Button";
import moment from "moment";
import React from "react";
import { connect, useSelector } from "react-redux";
import { TIME_ZONE } from "../../../common/utils/date";
import { authSelectors } from "../../../state/ducks/auth";
import { ChangeRequest, changeRequestsActions, ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AlertDialog from "../../app/alert.dialog/AlertDialog";
import TransitionDialog from "../../components/transitionDialog/TransitionDialog";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { EffectiveDateFormValues, PasswordFormValues } from "../form/types";
import ChangeRequestEffectiveDatePickerDialog from "./ChangeRequestEffectiveDatePickerDialog";

interface OwnProps {
  changeRequest: ChangeRequest;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  label: string;
  onSuccess?: () => void;
}

interface DispatchProps {
  applyTransition: typeof changeRequestsActions.applyTransition;
}

export type TransitionDialogContainerProps = OwnProps & DispatchProps;

/** Approver's password. */
let password = "";

export const TransitionDialogContainer: React.FunctionComponent<TransitionDialogContainerProps> = ({
  changeRequest,
  applyTransition,
  transition,
  buttonProps,
  label,
  onSuccess,
}) => {
  const transitionDialog = useDialog();
  const effectiveDateDialog = useDialog();
  const effectiveDatePickerDialog = useDialog();
  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess && onSuccess();
      transitionDialog.close();
    },
  });

  const effectiveDatePickerAsync = useAsync();

  const isCurrentEmployeeOwner = useSelector(authSelectors.currentEmployeeId) === changeRequest?.owner.id;
  const isDocNumeric = changeRequest?.documentRevisions && changeRequest?.documentRevisions[0]?.revisionStage === 1;
  const isDocEffectiveDateEligible = isDocNumeric || changeRequest?.approvals?.length > 1;

  /** Opens the transition dialog (approve submission). */
  const openTransitionDialog = () => {
    async.reset();
    transitionDialog.open();
  };

  /** Handles click on the Confirm button in Transition dialog.
   * @param values Approver's password.
   */
  const onTransitionDialogSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    if (isCurrentEmployeeOwner && isDocEffectiveDateEligible) {
      effectiveDateDialog.open();
      transitionDialog.close();
      password = (values as PasswordFormValues).password;
    } else {
      submitRequest(values);
    }
  };

  /** Sets the Effective date to be the same as Approved date. */
  const setEffectiveDateToApproveDate = () => {
    const values = {
      password,
      effectiveDate: moment().tz(TIME_ZONE, true).toISOString(),
    };
    submitRequest(values);
  };

  /** Opens the DatePicker dialog for the effective date selection. */
  const openEffectiveDatePickerDialog = () => {
    effectiveDatePickerDialog.open();
    effectiveDateDialog.close();
  };

  /** Starts the POST change_request request.
   * @param values Effective date and approver's password.
    */
  const submitRequest = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransition,
      changeRequest.id,
      values,
      transition,
      async,
    );
  };

  return (
    <>
      <TransitionDialog
        {...{
          buttonProps,
          transition,
          label,
        }}
        openDialog={openTransitionDialog}
        onSubmit={onTransitionDialogSubmit}
        isDialogOpen={transitionDialog.isOpen}
        closeDialog={transitionDialog.close}
        asyncState={async.asyncState}
        buttonProps={buttonProps}
      />
      <AlertDialog
        dialog={effectiveDateDialog}
        confirmAction={setEffectiveDateToApproveDate}
        cancelAction={openEffectiveDatePickerDialog}
        message={"transition.action.effective.date.message"}
        confirmLabel={"common.true"}
        cancelLabel={"common.false"}
      />
      <ChangeRequestEffectiveDatePickerDialog
        effectiveDatePickerDialog={effectiveDatePickerDialog}
        asyncState={effectiveDatePickerAsync.asyncState}
        onSubmit={(values) => submitRequest({
          ...values,
          password,
        })}
      />
    </>
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  applyTransition: changeRequestsActions.applyTransition,
})(TransitionDialogContainer);

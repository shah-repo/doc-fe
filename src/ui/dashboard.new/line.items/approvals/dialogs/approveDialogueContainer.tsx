import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { changeRequestsActions } from "../../../../../state/ducks/changeRequest";
import { ChangeRequestTransition, ChangeRequestTransitionResponse } from "../../../../../state/ducks/changeRequest/types";
import { EffectiveDateFormValues, PasswordFormValues } from "../../../../change.request/form/types";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import TransitionDialog from "./transitionDialog/TransitionDialog";

interface Props {
  changeRequestId: string;
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  arId?: string;
  title?: string;
  label: string;
  transitionDialog: any;
  onSuccess?: () => void;
}

const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  changeRequestId,
  arId,
  title,
  transition,
  buttonProps,
  label,
  transitionDialog,
  onSuccess,
}) => {
  const effectiveDateDialog = useDialog();
  const applyTransitionAction = useActionCreator(changeRequestsActions.applyTransition);

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      onSuccess && onSuccess();
      if (transition === "closed") {
        effectiveDateDialog.close();
      } else {
        transitionDialog.close();
      }
    },
    onError: (error) => {
      transitionDialog.close();
    },
  });

  const onSubmit = (values: PasswordFormValues | EffectiveDateFormValues) => {
    async.start(
      applyTransitionAction,
      changeRequestId, values, transition, async,
    );
  };

  return (
    <TransitionDialog
      // openDialog={openDialog}
      onSubmit={onSubmit}
      asyncState={async.asyncState}
      buttonProps={buttonProps}
      transition={transition}
      arId={arId}
      title={title}
      label={label}
      { ...{
        transitionDialog,
        effectiveDateDialog,
      }}
    />
  );
};

export default ApproveDialogueContainer;

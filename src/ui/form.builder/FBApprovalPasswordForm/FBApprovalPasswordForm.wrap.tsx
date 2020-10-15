import React from "react";
import { FB } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<FBApprovalPasswordFormProps>,
) => {
  const Comp = ({
    approvalTransition,
    approvalId,
  }) => {
    const { dialogState, formState } = FB.useStores();

    const onDialogClose = () => {
      dialogState?.closeDialog();
      formState?.reset();
    };

    return Component({
      approvalTransition,
      approvalId,
      dialogState,
      formState,
      onDialogClose,
    });
  };
  Comp.displayName = "withFBApprovalPasswordForm";
  return Comp;
};

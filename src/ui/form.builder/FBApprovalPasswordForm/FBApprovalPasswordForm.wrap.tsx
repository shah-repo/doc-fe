import React from "react";
import { FB, FBApprovalPasswordFormActions } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<FBApprovalPasswordFormProps>,
) => {
  const Comp = ({
    approvalTransition,
    approvalId,
    ...props
  }) => {
    const { dialogState, formState } = FB.useStores();

    const onDialogCancel = () => {
      dialogState?.closeDialog();
      formState?.reset();
    };

    const onDialogApprove = () => {
      approvalTransition?.("approve", approvalId);
      onDialogCancel();
    };

    React.useEffect(() => {
      dialogState?.setActions(
        <FBApprovalPasswordFormActions {...{ onDialogApprove, onDialogCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props),
      formState,
    });
  };
  Comp.displayName = "withFBApprovalPasswordForm";
  return Comp;
};

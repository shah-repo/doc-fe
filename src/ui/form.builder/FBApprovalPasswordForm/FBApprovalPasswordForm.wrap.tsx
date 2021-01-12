import React from "react";
import { FB, FBApprovalPasswordFormActions, FBFormState } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<FBApprovalPasswordFormProps>,
) => {
  const Comp = ({
    approvalTransition,
    approvalId,
    ...props
  }) => {
    const { dialogState } = FB.useStores();
    const formState = FB.useRef(FBFormState, {});

    const onDialogClose = () => {
      dialogState?.closeDialog();
      formState?.setFieldValue("password", null);
    };

    const onDialogApprove = () => {
      const password = formState?.getFieldValue("password");
      approvalTransition?.("approve", approvalId, password);
      onDialogClose();
    };

    React.useEffect(() => {
      dialogState?.setActions(
        <FBApprovalPasswordFormActions {...{ onDialogApprove, onDialogClose }} />
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

import React from "react";
import { FB } from "..";

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<any>,
) => {
  const Comp = ({
    approvalTransition,
    approvalId,
  }) => {
    const { dialogState, formState } = FB.useStores();

    return Component({
      approvalTransition,
      approvalId,
      dialogState,
      formState,
    });
  };
  Comp.displayName = "withFBApprovalPasswordForm";
  return Comp;
};

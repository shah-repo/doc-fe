import React from "react";
import { FB } from "..";

export const withFBInlinePasswordForm = (
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
  Comp.displayName = "withFBInlinePasswordForm";
  return Comp;
};

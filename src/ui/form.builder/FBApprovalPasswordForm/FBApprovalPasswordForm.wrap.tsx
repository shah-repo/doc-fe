import React from "react";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<FBApprovalPasswordFormProps>,
) => {
  const Comp = ({
    ...props
  }) => Component({
    ...(props),
  });
  Comp.displayName = "withFBApprovalPasswordForm";
  return Comp;
};

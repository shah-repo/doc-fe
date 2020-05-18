import React from "react";
import { FBApprovalMatrixFieldProps, FBApprovalMatrixFieldState } from ".";
import { FB } from "..";

export const withFBApprovalMatrixField = <T extends FBApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    approvalMatrixFieldState,
    disabled,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    approvalMatrixFieldState = FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, formValue);

    if (!disabled && !formValue) {
      approvalMatrixFieldState.fetch();
    }

    return Component({
      ...(props as T),
      approvalMatrixFieldState,
      disabled,
      name,
    });
  };

  return (props: T) => Comp(props);
};

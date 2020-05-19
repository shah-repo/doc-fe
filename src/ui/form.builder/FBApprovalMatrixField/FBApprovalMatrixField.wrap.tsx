import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixFieldProps, FBApprovalMatrixFieldState } from ".";
import { FB } from "..";

export const withFBApprovalMatrixField = <T extends FBApprovalMatrixFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    approvalMatrixFieldState,
    disabled,
    name,
    mode,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    approvalMatrixFieldState = FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, formValue);

    if (!disabled && !formValue) {
      approvalMatrixFieldState.fetch();
    }

    handleAdd = () => {
      approvalMatrixFieldState && (approvalMatrixFieldState.mode = "add");
    };

    useObserver(() => {
      mode = approvalMatrixFieldState?.mode;
    });

    return Component({
      ...(props as T),
      handleAdd,
      approvalMatrixFieldState,
      disabled,
      name,
      mode,
    });
  };

  return (props: T) => Comp(props);
};

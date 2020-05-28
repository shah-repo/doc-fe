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

    const { formState, workspaceState } = FB.useStores();
    const { document } = workspaceState || {};
    const formValue = formState?.getFieldValue(name);
    approvalMatrixFieldState = FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, formValue);

    async function fetchData() {
      const data = await approvalMatrixFieldState?.fetch();
      formState?.setFieldValue(name, data);
    }
    if ((!disabled && !formValue) || document?.outputRevision) {
      fetchData();
    }

    handleAdd = () => {
      approvalMatrixFieldState && (approvalMatrixFieldState.mode = "add");
    };

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

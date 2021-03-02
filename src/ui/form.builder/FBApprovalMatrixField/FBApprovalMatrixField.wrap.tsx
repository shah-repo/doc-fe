import { cloneDeep } from "lodash";
import { reaction } from "mobx";
import React from "react";
import { FB, FBApprovalMatrixFieldProps, FBApprovalMatrixFieldState } from "..";

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
    const { document: { outputRevision = false } = {}, isOutput } = workspaceState || {};
    const formValue = formState?.getFieldValue(name);
    approvalMatrixFieldState = FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, {
      formValue: cloneDeep(formValue),
      outputRevision,
      isOutput,
    });

    handleAdd = () => {
      approvalMatrixFieldState && (approvalMatrixFieldState.mode = "add");
    };

    React.useEffect(() => {
      reaction( // Form sync & autosave
        () => approvalMatrixFieldState?.data,
        (data) => {
          formState?.setFieldValue(name, cloneDeep(data));
          formState?.setFieldAutosave(name);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

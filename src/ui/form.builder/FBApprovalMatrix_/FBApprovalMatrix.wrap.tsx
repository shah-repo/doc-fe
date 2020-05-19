import React from "react";
import { FBApprovalMatrixProps } from ".";
import { FB, FBApprovalMatrixFieldData } from "..";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleSave,
    handleCancel,
    name,
    ...props
  }: T) => {

    const { formState, approvalMatrixFieldState } = FB.useStores();

    handleSave = () => {
      const formValue: Partial<FBApprovalMatrixFieldData> = formState?.getFieldValue(name);
      approvalMatrixFieldState?.setApprovalMatrix(formValue?.approvalMatrix);
      approvalMatrixFieldState?.setMode("none");
    };

    handleCancel = () => {
      const formValue: Partial<FBApprovalMatrixFieldData> = formState?.getFieldValue(name);
      formState?.setFieldValue(name, {
        ...formValue,
        approvalMatrix: formValue?.approvalMatrix?.pop(),
      });
      approvalMatrixFieldState?.setMode("none");
    };

    return Component({
      ...(props as T),
      handleSave,
      handleCancel,
      name,
    });
  };

  return (props: T) => Comp(props);
};

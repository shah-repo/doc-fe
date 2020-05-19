import React from "react";
import { FBApprovalMatrixProps } from ".";
import { FB, FBApprovalMatrixFieldData } from "..";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleSave,
    handleCancel,
    handleEdit,
    name,
    mode,
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

    handleEdit = () => {
      if (mode !== "edit") {
        approvalMatrixFieldState?.setMode("edit");
        return;
      }
      handleSave && handleSave();
    };

    return Component({
      ...(props as T),
      handleSave,
      handleCancel,
      handleEdit,
      name,
      mode,
    });
  };

  return (props: T) => Comp(props);
};

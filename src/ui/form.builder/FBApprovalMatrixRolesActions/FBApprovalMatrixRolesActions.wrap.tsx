import React from "react";
import { FBApprovalMatrixRolesActionsProps } from ".";
import { FB } from "..";

export const withFBApprovalMatrixRolesActions = <T extends FBApprovalMatrixRolesActionsProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleAdd,
    handleCancel,
    ...props
  }: T) => {

    const { approvalMatrixFieldState, dialogState, formState } = FB.useStores();

    handleAdd = () => {
      const formValues = formState?.getValues();
      approvalMatrixFieldState?.addApprovalRole(formValues);
      dialogState?.closeDialog();
    };

    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
    });
  };

  return (props: T) => Comp(props);
};

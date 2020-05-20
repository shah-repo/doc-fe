import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixRolesProps } from ".";
import { FB, FBApprovalMatrixRolesActions, FBData, FBDialogState, FBForm } from "..";

export const withFBApprovalMatrixRoles = <T extends FBApprovalMatrixRolesProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onClick,
    approvalRoles,
    dialogState,
    name,
    ...props
  }: T) => {

    const { approvalMatrixFieldState, formState } = FB.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    onClick = () => {
      dialogState?.config({
        open: true,
        title: "Add Role",
        content: <FBForm schema={FBData.approvalMatrixRoleSchema} />,
        actions: <FBApprovalMatrixRolesActions />,
      });
    };

    useObserver(() => {
      approvalRoles = approvalMatrixFieldState?.approvalRoles;
      formState?.setFieldValue(`${name}.approvalRoles`, approvalRoles);
    });

    return Component({
      ...(props as T),
      onClick,
      dialogState,
      approvalRoles,
      name,
    });
  };

  return (props: T) => Comp(props);
};

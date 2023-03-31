import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalMatrixRolesActions, FBApprovalMatrixRolesProps, FBDAMFields, FBData, FBDialogState, FBForm } from "..";

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
    const { formState } = FB.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    approvalRoles = useObserver(() => formState?.getFieldValue(FBDAMFields.DAR));

    onClick = () => {
      dialogState?.config({
        open: true,
        title: "form.build.approvalMatrix.addRole",
        content: <FBForm schema={FBData.approvalMatrixRoleSchema} />,
        actions: <FBApprovalMatrixRolesActions />,
      });
    };

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

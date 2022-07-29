import { get, isEmpty } from "lodash";
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

    const { approvalMatrixFieldState, workspaceState } = FB.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    const { formInput } = workspaceState || {};
    const darMatrix = get(formInput, FBDAMFields.DAR, []);

    onClick = () => {
      dialogState?.config({
        open: true,
        title: "Add Role",
        content: <FBForm schema={FBData.approvalMatrixRoleSchema} />,
        actions: <FBApprovalMatrixRolesActions />,
      });
    };

    useObserver(() => {
      approvalRoles = isEmpty(approvalMatrixFieldState?.data?.approvalRoles) ? darMatrix :
        approvalMatrixFieldState?.data?.approvalRoles;
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

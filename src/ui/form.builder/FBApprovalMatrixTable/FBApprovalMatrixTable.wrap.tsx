import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixTableClasses, FBApprovalMatrixTableProps } from ".";
import { FB } from "..";

export const withFBApprovalMatrixTable = <T extends FBApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    approvalRoles,
    approvalMatrix,
    classes,
    mode,
    ...props
  }: T) => {

    const { approvalMatrixFieldState } = FB.useStores();
    classes = FBApprovalMatrixTableClasses();

    useObserver(() => {
      approvalRoles = approvalMatrixFieldState?.approvalRoles;
      approvalMatrix = approvalMatrixFieldState?.approvalMatrix;
      mode = approvalMatrixFieldState?.mode;
    });

    return Component({
      ...(props as T),
      approvalRoles,
      approvalMatrix,
      classes,
      mode,
    });
  };

  return (props: T) => Comp(props);
};

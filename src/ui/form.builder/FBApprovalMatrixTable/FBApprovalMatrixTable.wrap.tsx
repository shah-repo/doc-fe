import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixTableClasses, FBApprovalMatrixTableProps } from ".";
import { FB, FBApprovalMatrixFieldData } from "..";

export const withFBApprovalMatrixTable = <T extends FBApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    approvalData,
    classes,
    mode,
    name,
    ...props
  }: T) => {

    const { approvalMatrixFieldState } = FB.useStores();
    classes = FBApprovalMatrixTableClasses();

    useObserver(() => {
      approvalData = approvalMatrixFieldState?.data as FBApprovalMatrixFieldData;
    });

    return Component({
      ...(props as T),
      approvalData,
      classes,
      mode,
      name,
    });
  };

  return (props: T) => Comp(props);
};

import { get, isEmpty } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { withResizeDetector } from "react-resize-detector";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixTableProps, FBApprovalMatrixTableState, FBDAMFields } from "..";
import FBApprovalMatrixTableClasses from "./FBApprovalMatrixTable.styles";

export const withFBApprovalMatrixTable = <T extends FBApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    cellHeight,
    approvalMatrixTableState,
    approvalData,
    classes,
    width,
    mode,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { approvalMatrixFieldState, workspaceState } = FB.useStores();
    const { formInput } = workspaceState || {};
    const damRoles = get(formInput, FBDAMFields.DAR, []);
    const damMatrix = get(formInput, FBDAMFields.DAM, []);
    approvalMatrixTableState = FB.useRef(FBApprovalMatrixTableState);
    classes = FBApprovalMatrixTableClasses();

    // MARK: @reactions

    // MARK: @helpers

    // // MARK: @methods
    cellHeight = (height: number, index: number): number => {
      if (!approvalMatrixTableState) { return height; }
      const activeHeight = approvalMatrixTableState.cellHeight[index];
      if (!activeHeight || (height > activeHeight)) {
        approvalMatrixTableState.cellHeight[index] = height;
      }
      return approvalMatrixTableState.cellHeight[index];
    };

    // MARK: @observer
    useObserver(() => {
      approvalData = {
        ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
        approvalMatrix: isEmpty(approvalData?.approvalMatrix) ? damMatrix : approvalData?.approvalMatrix,
        approvalRoles: isEmpty(approvalData?.approvalRoles) ? damRoles : approvalData?.approvalRoles,
      };
    });

    return Component({
      ...(props as T),
      cellHeight,
      approvalData,
      classes,
      mode,
      name,
    });
  };

  return withResizeDetector((props: T) => Comp(props));
};

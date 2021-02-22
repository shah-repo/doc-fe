import { useObserver } from "mobx-react";
import React from "react";
import { withResizeDetector } from "react-resize-detector";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixTableProps, FBApprovalMatrixTableState } from "..";
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
    const { approvalMatrixFieldState } = FB.useStores();
    classes = FBApprovalMatrixTableClasses();
    approvalMatrixTableState = FB.useRef(FBApprovalMatrixTableState);

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
      approvalData = approvalMatrixFieldState?.data as FBApprovalMatrixFieldData;
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

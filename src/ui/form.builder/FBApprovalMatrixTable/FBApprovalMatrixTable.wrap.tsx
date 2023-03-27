import { get, has } from "lodash";
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
    const approvalRoles = get(formInput, FBDAMFields.DAR, []);
    const formInputDAM = get(formInput, FBDAMFields.DAM, []);
    const isDAMInNewFormat = has(formInputDAM, "approvalMatrix");
    const approvalMatrix = isDAMInNewFormat ? formInputDAM.approvalMatrix : formInputDAM;
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
    approvalData = useObserver(() => ({
      ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
      approvalMatrix,
      approvalRoles,
    }));

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

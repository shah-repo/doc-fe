import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { UIEvent, useRef } from "react";
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
    const statusRef = useRef<HTMLDivElement>(null);
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

    const syncScroll = (event: UIEvent<HTMLElement>) => {
      const { scrollLeft } = event.currentTarget;

      if (statusRef.current) {
        statusRef.current.scrollLeft = scrollLeft;
      }
    };

    // MARK: @observer
    useObserver(() => {
      approvalData = {
        ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
        approvalRoles: approvalData?.approvalRoles || damRoles,
      };
    });

    return Component({
      ...(props as T),
      cellHeight,
      approvalData,
      classes,
      mode,
      name,
      statusRef,
      syncScroll,
    });
  };

  return withResizeDetector((props: T) => Comp(props));
};

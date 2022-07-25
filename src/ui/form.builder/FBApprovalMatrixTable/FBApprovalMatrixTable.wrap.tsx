import { get } from "lodash";
import { useObserver } from "mobx-react";
import React, { UIEvent } from "react";
import { withResizeDetector } from "react-resize-detector";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixTableProps, FBApprovalMatrixTableState, FBDAMFields } from "..";
import { useClientBoundRect } from "../../hooks/useClientBoundRect";
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

    // MARK: @reactions
    const [statusTableRect, statusTableRef] = useClientBoundRect();
    // TODO position scroller via css
    const calculatedScrollerBottom = statusTableRect?.bottom ? statusTableRect?.bottom - window.innerHeight : 0;
    const scrollerBottom = Math.max(calculatedScrollerBottom, 0);
    classes = FBApprovalMatrixTableClasses(scrollerBottom);

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

      if (statusTableRef.current) {
        statusTableRef.current.scrollLeft = scrollLeft;
      }
    };

    // MARK: @observer
    useObserver(() => {
      approvalData = {
        ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
        approvalMatrix: approvalData?.approvalMatrix || damMatrix,
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
      statusTableRef,
      syncScroll,
    });
  };

  return withResizeDetector((props: T) => Comp(props));
};

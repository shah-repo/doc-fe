import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { FBApprovalMatrixTableInfo, FBApprovalMatrixTableProps, FBApprovalMatrixTableStatus } from "..";
import { withFBApprovalMatrixTable } from "./FBApprovalMatrixTable.wrap";

const FBApprovalMatrixTable: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  approvalData,
  approvalData: { approvalRoles } = {},
  classes,
  mode,
  name,
  cellHeight,
  statusTableRef,
  syncScroll,
}) =>  (
  <Box display="flex" flexDirection="row" className={classes?.tableRoot}>
    {/* TODO remove inline styles */}
    <Box width="65%" style={{ zIndex: 2 }}>
      <FBApprovalMatrixTableInfo {...{ classes, approvalData, mode, name, cellHeight }} />
    </Box>
    {approvalRoles && !isEmpty(approvalRoles) && (
      <>
        {/* Mui box has missing ref prop, this is workaround to assing ref to it */}
        <Box
          width="35%"
          style={{ overflow: "hidden" }}
          {...{ ref: statusTableRef }}
        >
          <Box width="500%">
            <FBApprovalMatrixTableStatus {...{ classes, approvalData, mode, name, cellHeight }} />
          </Box>
        </Box>
        <Box
          width="35%"
          className={classes?.statusScroller}
          onScroll={syncScroll}
        >
          <Box width="500%" />
        </Box>
      </>
    )}
  </Box>
);

export default withFBApprovalMatrixTable(FBApprovalMatrixTable);

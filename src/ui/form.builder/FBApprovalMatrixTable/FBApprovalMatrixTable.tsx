import { Box } from "@material-ui/core";
import cx from "classnames";
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
}) =>  (
  <Box display="flex" flexDirection="row" className={classes?.tableRoot}>
    <Box width="65%">
      <FBApprovalMatrixTableInfo {...{ classes, approvalData, mode, name, cellHeight }} />
    </Box>
    {approvalRoles && !isEmpty(approvalRoles) && (
      <Box
        width="35%"
        className={cx(classes?.wrapperStatus, "containing-box-scrollbar")}
      >
        <Box width="500%">
          <FBApprovalMatrixTableStatus {...{ classes, approvalData, mode, name, cellHeight }} />
        </Box>
      </Box>
    )}
  </Box>
);

export default withFBApprovalMatrixTable(FBApprovalMatrixTable);

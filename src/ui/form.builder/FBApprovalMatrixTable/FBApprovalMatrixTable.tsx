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
}) =>  (
  <Box display="flex" flexDirection="row">
    <Box width="100%">
      <FBApprovalMatrixTableInfo {...{ classes, approvalData, mode, name }} />
    </Box>
    {approvalRoles && !isEmpty(approvalRoles) && (
      <Box width="65%"style={{ overflowX: "auto", overflowY: "hidden" }}>
        <FBApprovalMatrixTableStatus {...{ classes, approvalData, mode, name }} />
      </Box>
    )}
  </Box>
);

export default withFBApprovalMatrixTable(FBApprovalMatrixTable);

import { Box } from "@material-ui/core";
import React from "react";
import { FBApprovalMatrixTableInfo, FBApprovalMatrixTableProps, FBApprovalMatrixTableStatus } from "..";
import { withFBApprovalMatrixTable } from "./FBApprovalMatrixTable.wrap";

const FBApprovalMatrixTable: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  handleCheck,
  approvalRoles,
  approvalMatrix,
  classes,
  mode,
  name,
}) =>  (
  <Box display="flex" flexDirection="row">
    <Box width="100%">
      <FBApprovalMatrixTableInfo {...{ classes, approvalMatrix, mode, name, handleCheck }} />
    </Box>
    {approvalRoles && (
      <Box width="65%"style={{ overflowX: "auto", overflowY: "hidden" }}>
        <FBApprovalMatrixTableStatus {...{ classes, approvalMatrix, approvalRoles, mode, name, handleCheck }} />
      </Box>
    )}
  </Box>
);

export default withFBApprovalMatrixTable(FBApprovalMatrixTable);

import { Box } from "@material-ui/core";
import { isEmpty, sortBy } from "lodash";
import React from "react";
import { FBApprovalMatrixTableInfo, FBApprovalMatrixTableProps, FBApprovalMatrixTableStatus } from "..";
import { withFBApprovalMatrixTable } from "./FBApprovalMatrixTable.wrap";

const FBApprovalMatrixTable: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  approvalData,
  approvalData: { approvalRoles } = {},
  classes,
  mode,
  name,
}) =>  {
  const data = {
    approvalRoles: approvalData?.approvalRoles || [],
    approvalMatrix: sortBy(approvalData?.approvalMatrix, (row) => row.docType.name.toLowerCase()) || [],
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box width="100%">
        <FBApprovalMatrixTableInfo {...{ classes, approvalData: data, mode, name }} />
      </Box>
      {approvalRoles && !isEmpty(approvalRoles) && (
        <Box width="65%"style={{ overflowX: "auto", overflowY: "hidden" }}>
          <FBApprovalMatrixTableStatus {...{ classes, approvalData: data, mode, name }} />
        </Box>
      )}
    </Box>
  );
};

export default withFBApprovalMatrixTable(FBApprovalMatrixTable);

import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBApprovalMatrixFieldProps, FBApprovalMatrixTableProps } from "./FBApprovalMatrix.types";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";
import FBApprovalMatrixField from "./FBApprovalMatrixField/FBApprovalMatrixField";

const FBApprovalMatrix: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  amState,
  ...props
}) => (
  <Provider {...{ amState }}>
    <Box mb={3}>
      <FBApprovalMatrixField {...props as FBApprovalMatrixTableProps} />
    </Box>
  </Provider>
);

export default withFBApprovalMatrix(FBApprovalMatrix);

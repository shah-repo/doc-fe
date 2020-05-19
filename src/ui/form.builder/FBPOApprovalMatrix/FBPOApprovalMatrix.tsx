import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBPOApprovalMatrixAddItemProps, FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixAddItem from "./form/FBPOApprovalMatrixAddItem";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  poamState,
  ...props
}) => (
  <Provider {...{ poamState }}>
    <Box mt={3}>
      <FBSectionBox label={props.label} />
      <FBPOApprovalMatrixTable {...props as FBPOApprovalMatrixTableProps} />
      <FBPOApprovalMatrixAddItem {...props as FBPOApprovalMatrixAddItemProps} />
    </Box>
  </Provider>
);

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);

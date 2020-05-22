import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog } from "..";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  handleAdd,
  handleRevert,
  poamState,
  dialogState,
  ...props
}) => (
  <Provider {...{ poamState, dialogState }}>
    <FBDialog />
    <Box mt={3}>
      <FBSectionBox label={props.label} {...{ handleRevert }} />
      <FBPOApprovalMatrixTable {...props as FBPOApprovalMatrixTableProps} />
      <FBButton
        fullWidth={true}
        disabled={props.disabled}
        label="form.builder.add.item"
        onClick={handleAdd}
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
    </Box>
  </Provider>
);

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);

import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBInput } from "..";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  handleAdd,
  handleRevert,
  poamState,
  dialogState,
  name,
  autosave,
  ...props
}) => (
  <Provider {...{ poamState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, autosave }} disabled={props.disabled} type="poApprovalMatrix">
      <Box mt={3}>
        <FBSectionBox label={props.label} {...{ handleRevert }} />
        <FBPOApprovalMatrixTable {...{ name }} {...props as FBPOApprovalMatrixTableProps} />
        <FBButton
          fullWidth={true}
          disabled={props.disabled}
          label="form.builder.add.item"
          onClick={handleAdd}
          variant="outlined"
          style={{ margin: "8px 0" }}
        />
      </Box>
    </FBInput>
  </Provider>
);

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);

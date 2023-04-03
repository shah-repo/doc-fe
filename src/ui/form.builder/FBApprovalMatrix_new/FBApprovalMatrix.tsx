import React from "react";
import { Box } from "@material-ui/core";
import { FBApprovalMatrixTable, FBButton, FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";
import { FBApprovalMatrixProps } from "./FBApprovalMatrix.types";
import FBApprovalMatrixGrid from "./components/Grid";

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = ({
  handleAdd,
  handleSave,
  handleCancel,
  disabled,
  name,
  mode,
}) => (
  <>
    <FBApprovalMatrixGrid />
    <FBApprovalMatrixTable {...{ name, mode }} />
    <Box mt={2}>
      {mode === "add" && (
        <Box display="flex" flexDirection="row-reverse">
          <FBSubmitButton
            variant="outlined"
            label="common.save"
            onClick={handleSave}
            autoFocus
          />
          <StyledCancelFBButton
            variant="outlined"
            label="common.cancel"
            onClick={handleCancel}
          />
        </Box>
      )}
      {mode !== "add" && (
        <FBButton
          fullWidth={true}
          label="form.builder.add.item"
          dataCy="form.builder.add.item"
          variant="outlined"
          style={{ margin: 0 }}
          onClick={handleAdd}
          {...{ disabled }}
        />
      )}
    </Box>
  </>
);

export default withFBApprovalMatrix(FBApprovalMatrix);

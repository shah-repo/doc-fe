import { Box } from "@material-ui/core";
import React from "react";
import { FBApprovalMatrixProps, FBApprovalMatrixSection, FBApprovalMatrixTable, FBButton, FBDialog, FBProvider, FBSubmitButton } from "..";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";

const FBApprovalMatrix: React.FunctionComponent<FBApprovalMatrixProps> = ({
  handleAdd,
  handleSave,
  handleCancel,
  handleEdit,
  handleFullScreen,
  dialogState,
  disabled,
  name,
  mode,
  workspaceMode,
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog onClose={handleFullScreen} />
    {!dialogState?.open && (
      <>
        <FBApprovalMatrixSection
          {...{ handleEdit, handleFullScreen, disabled, mode, workspaceMode, dialogState }}
        />
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
              <FBButton
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
    )}
  </FBProvider>
);

export default withFBApprovalMatrix(FBApprovalMatrix);

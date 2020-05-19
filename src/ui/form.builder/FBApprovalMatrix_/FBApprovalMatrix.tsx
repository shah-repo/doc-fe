import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import FullscreenOutlinedIcon from "@material-ui/icons/FullscreenOutlined";
import React from "react";
import { FBApprovalMatrixProps, FBApprovalMatrixTable, FBButton, FBSection, FBSubmitButton, FBTooltip } from "..";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";

const FBApprovalMatrix: React.FunctionComponent<FBApprovalMatrixProps> = ({
  handleAdd,
  handleSave,
  handleCancel,
  disabled,
  name,
  mode,
}) =>  (
  <>
    <FBSection label="form.builder.approvalMatrix">
      <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
        <IconButton color="inherit" size="small"{...{ disabled }} >
          <FBTooltip title='form.builder.fullscreen.mode'>
            <FullscreenOutlinedIcon />
          </FBTooltip>
        </IconButton>
        <IconButton color="inherit" size="small" {...{ disabled }} >
          <FBTooltip title='form.builder.edit.matrix'>
            <EditIcon fontSize="small" />
          </FBTooltip>
        </IconButton>
      </Box>
    </FBSection>
    <FBApprovalMatrixTable {...{ name }} />
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

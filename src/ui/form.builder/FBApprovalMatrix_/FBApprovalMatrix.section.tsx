import { Box, IconButton } from "@material-ui/core";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import EditIcon from "@material-ui/icons/Edit";
import FullscreenOutlinedIcon from "@material-ui/icons/FullscreenOutlined";
import React from "react";
import { FBApprovalMatrixProps, FBSection, FBTooltip } from "..";

const FBApprovalMatrixSection: React.FunctionComponent<FBApprovalMatrixProps> = ({
  handleEdit,
  handleFullScreen,
  disabled,
  mode,
  workspaceMode,
  dialogState,
  name,
}) => (
  <FBSection
    name={`fb-am-section-${name}`}
    label="form.builder.approvalMatrix"
  >
    <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
      {!dialogState?.open && (
        <IconButton color="inherit" size="small" disabled={workspaceMode === "design"} onClick={handleFullScreen} >
          <FBTooltip title='form.builder.fullscreen.mode'>
            <FullscreenOutlinedIcon />
          </FBTooltip>
        </IconButton>
      )}
      <IconButton data-cy="EditBtnDAM" color="inherit" size="small" {...{ disabled }} onClick={handleEdit} >
        {mode !== "edit" && (
          <FBTooltip title='form.builder.edit.matrix'>
            <EditIcon fontSize="small" />
          </FBTooltip>
        )}
        {mode === "edit" && (
          <FBTooltip title="form.builder.exit.edit.mode" >
            <CancelPresentationIcon fontSize="small" />
          </FBTooltip>
        )}
      </IconButton>
    </Box>
  </FBSection>
);

export default FBApprovalMatrixSection;

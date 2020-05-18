import { Box, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import FullscreenOutlinedIcon from "@material-ui/icons/FullscreenOutlined";
import React from "react";
import { FBApprovalMatrixProps, FBButton, FBSection, FBTooltip } from "..";

const FBApprovalMatrix: React.FunctionComponent<FBApprovalMatrixProps> = ({
  disabled,
  ...props
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
    <FBButton
      fullWidth={true}
      label="form.builder.add.item"
      variant="outlined"
      style={{ margin: 0 }}
      {...{ disabled }}
    />
  </>
);

export default FBApprovalMatrix;

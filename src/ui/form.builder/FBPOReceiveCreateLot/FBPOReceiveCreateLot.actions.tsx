import { Box } from "@material-ui/core";
import React from "react";
import { FBPOReceiveCreateLotProps, FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
import { withFBPOReceiveCreateLot } from "./FBPOReceiveCreateLot.wrap";

const FBPOReceiveCreateLotActions: React.FunctionComponent<FBPOReceiveCreateLotProps> = ({
  handleCancel,
  handleCreateLot,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label="form.builder.po.create.lot"
      onClick={handleCreateLot}
    />
    <StyledCancelFBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBPOReceiveCreateLot(FBPOReceiveCreateLotActions);

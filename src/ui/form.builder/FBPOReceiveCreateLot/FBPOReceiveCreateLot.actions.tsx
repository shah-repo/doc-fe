import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBPOReceiveCreateLotProps, FBSubmitButton } from "..";
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
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBPOReceiveCreateLot(FBPOReceiveCreateLotActions);

import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBPurchaseOrderActionsProps, FBSubmitButton } from "..";


const FBPurchaseOrderActions: React.FunctionComponent<FBPurchaseOrderActionsProps> = ({
  onAddClick,
  onCancelClick,
  ...props
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={onAddClick}
      autoFocus
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={onCancelClick}
    />
  </Box>
);

export default FBPurchaseOrderActions;

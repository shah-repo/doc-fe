import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBMPIProcedureSelectActionsProps, FBSubmitButton } from "..";

const FBMPIProcedureSelectActions: React.FunctionComponent<FBMPIProcedureSelectActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label={"form.builder.save"}
      onClick={handleAdd}
    />
    <FBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default FBMPIProcedureSelectActions;

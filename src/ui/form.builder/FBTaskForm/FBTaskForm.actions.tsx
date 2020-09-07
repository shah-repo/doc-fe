import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton, FBTaskFormProps } from "..";

const FBTaskFormActions: React.FunctionComponent<FBTaskFormProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={3}>
    <FBSubmitButton
      variant="contained"
      label="form.builder.add"
      onClick={handleAdd}
    />
    <FBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default FBTaskFormActions;

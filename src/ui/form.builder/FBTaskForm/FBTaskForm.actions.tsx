import { Box } from "@material-ui/core";
import React from "react";
import { FBSubmitButton, FBTaskFormProps } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";

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
    <StyledCancelFBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default FBTaskFormActions;

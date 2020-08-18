import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBDocumentRevisionsActionsProps, FBSubmitButton } from "..";

const FBDocumentRevisionsActions: React.FunctionComponent<FBDocumentRevisionsActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={2}>
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

export default FBDocumentRevisionsActions;

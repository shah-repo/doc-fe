import { Box } from "@material-ui/core";
import React from "react";
import { FBDocumentRevisionsActionsProps, FBSubmitButton } from "..";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";

const FBDocumentRevisionsActions: React.FunctionComponent<FBDocumentRevisionsActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={2}>
    <FBSubmitButton
      variant="contained"
      label="form.builder.add"
      onClick={handleAdd}
      dataCy="arAddDocumentDialogAddBtn"
    />
    <StyledCancelFBButton
      variant="outlined"
      label="form.builder.cancel"
      onClick={handleCancel}
      dataCy="arAddDocumentDialogCancelBtn"
    />
  </Box>
);

export default FBDocumentRevisionsActions;

import { Box } from "@material-ui/core";
import React from "react";
import { FBSubmitButton } from "../..";
import FBButton from "../../components/inputs/FBButton";
import { FBDocumentRevisionActionsProps } from "./FBDocumentRevisionActions.types";
import { withFBDocumentRevisionActions } from "./FBDocumentRevisionActions.wrap";

const FBDocumentRevisionActions: React.FunctionComponent<FBDocumentRevisionActionsProps> = ({
  handleAdd,
  handleCancel,
}) => (
  <Box display="flex" flexDirection="row-reverse" mx={2}>
    <FBSubmitButton
      variant="outlined"
      label="common.add"
      onClick={handleAdd}
      autoFocus
    />
    <FBButton
      variant="outlined"
      label="common.cancel"
      onClick={handleCancel}
    />
  </Box>
);

export default withFBDocumentRevisionActions(FBDocumentRevisionActions);

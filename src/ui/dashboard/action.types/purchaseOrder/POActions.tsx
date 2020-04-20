import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import POApproveOrReject from "./POApproveOrReject";

interface Props {
  documentRevision: DocumentRevision;
}

export const POActions: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const { changeRequest: { id: changeRequestId = "" } = {} } = documentRevision;

  return (
    <Box>
      {
        documentRevision.changeRequest &&
        <POApproveOrReject changeRequestId={changeRequestId} />
      }
    </Box>
  );
};

export default POActions;

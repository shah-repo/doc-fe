import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import GenerateHtmlPreview from "../../../documentRevision/forms/presenters/GenerateHtmlPreview";
import POApproveOrReject from "./POApproveOrReject";

interface Props {
  documentRevision: DocumentRevision;
}

export const POActions: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const { changeRequest: { id: changeRequestId = "" } = {} } = documentRevision;

  return (
    <Box display="flex" flexDirection="column">
      {
        documentRevision.changeRequest &&
        <POApproveOrReject changeRequestId={changeRequestId} />
      }
      <Box display="flex" justifyContent="flex-end">
        <GenerateHtmlPreview
          id={documentRevision.id}
          renderHTML={documentRevision.formDocument?.renderHTML}
        />
      </Box>
    </Box>
  );
};

export default POActions;

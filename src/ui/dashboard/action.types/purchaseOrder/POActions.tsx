import { Box } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import GenerateHtmlPreview from "../../../documentRevision/forms/presenters/GenerateHtmlPreview";
import POApproveOrReject from "./POApproveOrReject";

interface Props {
  documentRevision: DocumentRevision;
}

const POActions: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const { changeRequest: { id: changeRequestId = "" } = {} } = documentRevision;

  return (
    <Box display="flex">
      <GenerateHtmlPreview
        id={documentRevision.id}
        renderHTMLDefined={documentRevision.formDocument?.renderHTMLDefined}
        showDownloadButton={true}
      />
      {
        documentRevision.changeRequest &&
        <POApproveOrReject changeRequestId={changeRequestId} />
      }
    </Box>
  );
};

export default POActions;

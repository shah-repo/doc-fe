import { Button } from "@material-ui/core";
import * as React from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";

interface Props {
  handleCancelDraft: any;
  documentStatus: DocumentRevisionStatus;
  documentRevision?: DocumentRevision;
}

const CancelButton: React.FunctionComponent<Props> = ({
  handleCancelDraft,
  documentStatus,
  documentRevision,
}) => {
  const canShowCancelButton = documentStatus === DocumentRevisionStatus.Draft && (documentRevision?.version || 0) > 1;

  return (
    <>
      {
        canShowCancelButton &&
        <Button id="cancelDraftButton" variant="outlined" onClick={handleCancelDraft}>
          <Text translation="common.cancel.draft" />
        </Button>}
    </>
  );
};

export default CancelButton;

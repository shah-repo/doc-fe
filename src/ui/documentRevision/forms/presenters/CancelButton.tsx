import { Button } from "@material-ui/core";
import * as React from "react";
import { useEffect } from "react";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { checkIsDocumentRecord } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../helpers/documentRevisionStatus";

interface Props {
  documentRevision: DocumentRevision;
  setShouldDisplay: (value: boolean) => void;
}

const CancelButton: React.FunctionComponent<Props> = ({
  documentRevision,
  setShouldDisplay,
}) => {
  const dialog = useDialog();
  const async = useAsync();
  const { status = "", version = 0, id, document } = documentRevision || [];

  const canShowCancelButton = isDocumentRevisionInDraft(status) && version > 1;
  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions || []);

  useEffect(() => {
    setShouldDisplay(canShowCancelButton);
  }, [canShowCancelButton, setShouldDisplay]);

  const cancelDraft = useActionCreator(documentRevisionsActions.cancelDraft);
  const handleCancelDraft = () => {
    async.start(cancelDraft, id, async);
  };

  return (
    <>
      {
        canShowCancelButton &&
        <Button id="cancelDraftButton" data-cy="cancelDraftButton" variant="outlined" onClick={dialog.open}>
          <Text translation="common.cancel.draft" />
        </Button>
      }
      <AlertDialog
        confirmAction={handleCancelDraft}
        message={isRecord ? "record.cancel.draft.alert" : "document.revision.cancel.draft.alert"}
        {...{ dialog }}
      />
    </>
  );
};

export default CancelButton;

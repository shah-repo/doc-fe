import { Button } from "@material-ui/core";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  docRevId: string;
  revisionStage?: number;
  status?: DocumentRevisionStatus;
}

export const FinalizeAndRelease: React.FunctionComponent<Props> = ({
  docRevId,
  revisionStage,
  status,
}) => {
  const releaseRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const async = useAsync();

  const releaseRecord = () => {
    async.start(
      applyTransition,
      docRevId,
      "in_review",
      async,
    );
  };

  if (!docRevId || status !== DocumentRevisionStatus.Draft/*  || revisionStage !== 2 */) {
    return null;
  }

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        /* onClick={releaseRecordDialog.open} */
        onClick={releaseRecord}
        id="ApproveAndRelease-button"
        data-cy="ApproveAndRelease-button"
      >
        <Text message="document.action.to_review" />
      </Button>
      <AlertDialog
        dialog={releaseRecordDialog}
        message="record.release.alert"
        confirmLabel="common.true"
        cancelLabel="common.false"
        confirmAction={releaseRecord}
      />
    </>
  );

};

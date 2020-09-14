import { Button } from "@material-ui/core";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";

interface Props {
  docRevId: string;
  revisionStage: number;
  subRevision?: number;
  status?: DocumentRevisionStatus;
  revisionChangeType: string;
}

export const FinalizeAndRelease: React.FunctionComponent<Props> = ({
  docRevId,
  revisionStage,
  subRevision,
  status,
  revisionChangeType,
}) => {
  const releaseRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isSubmitApproval = revisionStage === 3 && (subRevision && subRevision > 0);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
      releaseRecordDialog.close();
    },
  });

  let buttonText = "record.finalize.and.release";
  if (isSubmitApproval) {
    buttonText = "record.submit.for.approval";
  }
  if (isObsolete) {
    buttonText = "common.void";
  }

  const releaseRecord = () => {
    async.start(
      applyTransition,
      docRevId,
      "in_review",
      async,
    );
  };

  if (!docRevId || status !== DocumentRevisionStatus.Draft) {
    return null;
  }

  return (
    <>
      <Button
        color="secondary"
        variant="outlined"
        onClick={releaseRecordDialog.open}
        id="ApproveAndRelease-button"
        data-cy="ApproveAndRelease-button"
      >
        <Text message={buttonText} />
      </Button>
      <AlertDialog
        dialog={releaseRecordDialog}
        message={isObsolete ? "documentRevision.void.alert" : "record.release.alert"}
        confirmLabel="common.true"
        cancelLabel="common.false"
        confirmAction={releaseRecord}
      />
    </>
  );

};

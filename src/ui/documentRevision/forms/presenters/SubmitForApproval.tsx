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
  status?: DocumentRevisionStatus;
  revisionChangeType: string;
}

export const SubmitForApproval: React.FunctionComponent<Props> = ({
  docRevId,
  status,
  revisionChangeType,
}) => {
  const releaseRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
      releaseRecordDialog.close();
    },
  });

  let buttonText = "record.submit.for.approval";
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
        onClick={isObsolete ? releaseRecordDialog.open : releaseRecord}
        id="ApproveAndRelease-button"
        data-cy="ApproveAndRelease-button"
      >
        <Text message={buttonText} />
      </Button>
      {isObsolete && <AlertDialog
        dialog={releaseRecordDialog}
        message={"documentRevision.void.alert"}
        confirmLabel="common.true"
        cancelLabel="common.false"
        confirmAction={releaseRecord}
      />
      }
    </>
  );

};

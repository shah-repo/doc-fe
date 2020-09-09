import { Button } from "@material-ui/core";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
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
}

export const FinalizeAndRelease: React.FunctionComponent<Props> = ({
  docRevId,
  revisionStage,
  subRevision,
  status,
}) => {
  const releaseRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isSubmitApproval = revisionStage === 3 && (subRevision && subRevision > 0);
  const async = useAsync({
    onError: (error) => {
      toastError(error as string);
      releaseRecordDialog.close();
    },
  });

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
        {
          isSubmitApproval ?
            <Text message="record.submit.for.approval" /> :
            <Text message="record.finalize.and.release" />
        }
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

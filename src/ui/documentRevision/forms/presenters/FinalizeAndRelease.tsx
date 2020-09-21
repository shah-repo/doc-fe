import { Box, Button, Dialog, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React from "react";
import { documentRevisionsActions, DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import AlertDialog from "../../../app/alert.dialog/AlertDialog";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import { FB, FBFormState, FBProvider, FBSubmitButton, FBTextField } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { styles } from "./FinalizeAndRelease.styles";

interface Props {
  docRevId: string;
  revisionStage: number;
  subRevision?: number;
  status?: DocumentRevisionStatus;
  revisionChangeType: string;
  docRevOwner: string;
  updatedAt?: string;
}

export const FinalizeAndRelease: React.FunctionComponent<Props> = ({
  docRevId,
  revisionStage,
  subRevision,
  status,
  revisionChangeType,
  docRevOwner,
  updatedAt,
}) => {
  const classes = styles();
  const releaseRecordDialog = useDialog();
  const voidRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isSubmitApproval = revisionStage === 3 && (subRevision && subRevision > 0);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const releaseAsync = useAsync({
    onError: (error) => {
      toastError(error as string);
      releaseRecordDialog.close();
      voidRecordDialog.close();
    },
  });
  const updateDocAsync = useAsync({
    onSuccess: () => {
      releaseRecord();
    },
  });

  const formState = FB.useRef(FBFormState, {});
  const save = useActionCreator(documentRevisionsActions.save);

  let buttonText = "record.finalize.and.release";
  if (isSubmitApproval) {
    buttonText = "record.submit.for.approval";
  }
  if (isObsolete) {
    buttonText = "common.void";
  }

  /** Sends record to review. */
  const releaseRecord = () => {
    releaseAsync.start(
      applyTransition,
      docRevId,
      "in_review",
      releaseAsync,
    );
  };

  /** Adds reason for voiding a record to description and sends the record to review. */
  const voidRecord = () => {
    updateDocAsync.start(
      save,
      docRevId,
      {
        description: `<p>Void</p>
        <p>${formState?.getValues().voidDescription}</p>
        <p>${docRevOwner}, ${updatedAt}</p>`,
      },
      updateDocAsync,
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
        onClick={isObsolete ? voidRecordDialog.open : releaseRecordDialog.open}
        id="ApproveAndRelease-button"
        data-cy="ApproveAndRelease-button"
      >
        <Text message={buttonText} />
      </Button>
      <Dialog
        open={voidRecordDialog.isOpen}
      >
        <DialogContent>
          <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
            <Box textAlign="center">
              <span className={classes.iconContainer}>
                <ReportProblemOutlinedIcon color="error" />
              </span>
              <Typography variant="h6" style={{ marginTop: 20, marginBottom: 5 }}>
                <Text translation="common.alert" />
              </Typography>
            </Box>
            <DialogContentText>
              <Box className={classes.dialogContent }>
                <Text translation="record.void.alert" />
              </Box>
            </DialogContentText>
          </Box>
          <FBProvider {...{ formState }} >
            <FBTextField
              name="voidDescription"
              label="common.description"
              dataCy="void.record.description"
              rules="required"
              rows={3}
            />
            <Box display="flex" mx={3}>
              <Button
                variant="outlined"
                onClick={() => voidRecordDialog.close()}
              >
                <Text translation="common.false" />
              </Button>
              <FBSubmitButton
                variant="contained"
                label="common.true"
                onClick={voidRecord}
                fullWidth
              />
            </Box>
          </FBProvider>
        </DialogContent>
      </Dialog>
      <AlertDialog
        dialog={releaseRecordDialog}
        message={"record.release.alert"}
        confirmLabel="common.true"
        cancelLabel="common.false"
        confirmAction={releaseRecord}
      />
    </>
  );
};

import { Box, Button, Dialog, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { StyledButton } from "../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListItem } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../../App/Shifamed/Utils/SM/SM";
import { documentRevisionsActions } from "../../../../state/ducks/documentRevisions";
import { DocumentType } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, RevisionChangeType } from "../../../../state/ducks/documentRevisions/types";
import { toastError } from "../../../components/notifications";
import Text from "../../../components/Text";
import { FB, FBFormState, FBProvider, FBSubmitButton, FBTextField } from "../../../form.builder";
import FBStore from "../../../form.builder/FBStore/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { checkIsDocumentMPIOutput } from "../../helpers/checkDocumentGroup";
import { styles } from "./FinalizeAndRelease.styles";

interface Props {
  docRevId: string;
  status?: DocumentRevisionStatus;
  revisionChangeType: string;
  docRevOwner: string;
  updatedAt?: string;
  currentDocumentType?: DocumentType;
  renderAsButton?: boolean;
  hasBuildType?: boolean;
}

export const SubmitForApproval: React.FunctionComponent<Props> = ({
  docRevId,
  status,
  revisionChangeType,
  docRevOwner,
  updatedAt,
  currentDocumentType,
  renderAsButton,
  hasBuildType,
}) => {
  const isNewLayout = SM.isNewLayout;
  const classes = styles();
  const dispatch = useDispatch();
  const voidRecordDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const isTypeMpiOutput = checkIsDocumentMPIOutput(currentDocumentType?.groupOptions);
  const label = isTypeMpiOutput ? "record.complete.step" : "record.submit.for.approval";
  const releaseAsync = useAsync({
    onError: (error) => {
      toastError(error as string);
      voidRecordDialog.close();
    },
  });
  const updateDocAsync = useAsync({
    onSuccess: () => {
      if ( FBStore?.isHistoryTabSelected) {
        dispatch(documentRevisionsActions.loadAudit(docRevId));
      }
      releaseRecord();
    },
  });

  const intl = useIntl();
  const formState = FB.useRef(FBFormState, {});
  const save = useActionCreator(documentRevisionsActions.save);

  const releaseRecord = () => {
    if (!hasBuildType) {
      return toastError(intl.formatMessage({ id: "form.builder.lhr.build.type.error.message" }));
    }
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
      {isNewLayout ? (
        renderAsButton ? <StyledButton
          color="primary"
          onClick={isObsolete ? voidRecordDialog.open : releaseRecord}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isObsolete ? "common.void" : label} />
        </StyledButton> : <StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListItemText
            onClick={isObsolete ? voidRecordDialog.open : releaseRecord}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
            primary={ <Text message={isObsolete ? "common.void" : label} />}
          />
        </StyledMenuListItem>
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={isObsolete ? voidRecordDialog.open : releaseRecord}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isObsolete ? "common.void" : label} />
        </Button>
      )}
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
    </>
  );
};

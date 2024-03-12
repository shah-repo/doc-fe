import { Box, Button, Dialog, DialogContent, DialogContentText, Typography } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP, DocumentType } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus, RevisionChangeType } from '../../../../state/ducks/documentRevisions/types';
import Text from '../../../components/Text';
import { toastError } from '../../../components/notifications';
import { FB, FBFormState, FBProvider, FBSubmitButton, FBTextField } from '../../../form.builder';
import FBStore from '../../../form.builder/FBStore/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from '../../helpers/checkDocumentGroup';
import { styles } from './FinalizeAndRelease.styles';

interface Props {
  docRevId: string
  description?: string
  status?: DocumentRevisionStatus
  revisionChangeType: string
  docRevOwner: string
  updatedAt?: string
  currentDocumentType?: DocumentType
  renderAsButton?: boolean
  hasBuildType?: boolean
}

export const SubmitForApproval: React.FunctionComponent<Props> = ({
  docRevId,
  description,
  status,
  revisionChangeType,
  docRevOwner,
  updatedAt = '',
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
  const isLhrDoc = checkIsDocumentLHR(currentDocumentType?.groupOptions);
  const isLot = currentDocumentType?.group === DOC_TYPE_GROUP.LOT;
  const label = isTypeMpiOutput ? 'record.complete.step' : 'record.submit.for.approval';
  const releaseAsync = useAsync({
    onError: (error) => {
      toastError(error as string);
      voidRecordDialog.close();
    },
  });
  const updateDocAsync = useAsync({
    onSuccess: () => {
      if (FBStore?.isHistoryTabSelected) {
        dispatch(documentRevisionsActions.loadAudit(docRevId));
      }
      releaseRecord();
    },
  });

  const intl = useIntl();
  const formState = FB.useRef(FBFormState, {});
  const save = useActionCreator(documentRevisionsActions.save);

  const releaseRecord = () => {
    if (!hasBuildType && isLhrDoc) {
      toastError(intl.formatMessage({ id: 'form.builder.lhr.build.type.error.message' }));
      return;
    }
    releaseAsync.start(
      applyTransition,
      docRevId,
      'in_review',
      releaseAsync,
    );
  };

  /** Adds reason for voiding a record to description and sends the record to review. */
  const voidRecord = () => {
    const reason = String(formState?.getValues().voidDescription);
    const voidDescription = `<p>Void</p><p>${reason}</p><p data-source="void">${docRevOwner}, ${updatedAt}</p>`;
    const updatedDescription = isLot && description
      ? `${voidDescription}${description}`
      : voidDescription;
    updateDocAsync.start(
      save,
      docRevId,
      { description: updatedDescription },
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
          <Text message={isObsolete ? 'common.void' : label} />
        </StyledButton> : <StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListItemText
            onClick={isObsolete ? voidRecordDialog.open : releaseRecord}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
            primary={ <Text message={isObsolete ? 'common.void' : label} />}
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
          <Text message={isObsolete ? 'common.void' : label} />
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

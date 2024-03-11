import { Button } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DOC_TYPE_GROUP, DocumentType } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../../../state/ducks/documentRevisions/types';
import VoidAlertDialog from '../../../app/alert.dialog/VoidAlertDialog';
import Text from '../../../components/Text';
import { toastError } from '../../../components/notifications';
import { FB, FBFormState } from '../../../form.builder';
import FBStore from '../../../form.builder/FBStore/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from '../../helpers/checkDocumentGroup';

interface Props {
  documentRevision: DocumentRevision
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
  documentRevision,
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
  const dispatch = useDispatch();
  const dialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isObsolete = revisionChangeType === RevisionChangeType.Obsolete;
  const isTypeMpiOutput = checkIsDocumentMPIOutput(currentDocumentType?.groupOptions);
  const isLhrDoc = checkIsDocumentLHR(currentDocumentType?.groupOptions);
  const isLot = currentDocumentType?.group === DOC_TYPE_GROUP.LOT;
  const label = isTypeMpiOutput ? 'record.complete.step' : 'record.submit.for.approval';
  const releaseAsync = useAsync({
    onError: (error) => {
      toastError(error as string);
      dialog.close();
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
          onClick={isObsolete ? dialog.open : releaseRecord}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isObsolete ? 'common.void' : label} />
        </StyledButton> : <StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListItemText
            onClick={isObsolete ? dialog.open : releaseRecord}
            id="ApproveAndRelease-button"
            data-cy="ApproveAndRelease-button"
            primary={<Text message={isObsolete ? 'common.void' : label} />}
          />
        </StyledMenuListItem>
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={isObsolete ? dialog.open : releaseRecord}
          id="ApproveAndRelease-button"
          data-cy="ApproveAndRelease-button"
        >
          <Text message={isObsolete ? 'common.void' : label} />
        </Button>
      )}
      <VoidAlertDialog
        dialog={dialog}
        documentRevision={documentRevision}
        confirmAction={voidRecord}
      />
    </>
  );
};

import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyledButton } from '../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListItem } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../App/Shifamed/Utils/SM/SM';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentType } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus, RevisionChangeType } from '../../../../state/ducks/documentRevisions/types';
import SupplierStatusDialog from '../../../app/alert.dialog/SupplierStatusDialog';
import VoidAlertDialog from '../../../app/alert.dialog/VoidAlertDialog';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import FBStore from '../../../form.builder/FBStore/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { checkIsDocumentEquipment, checkIsDocumentLHR, checkIsDocumentMPIOutput } from '../../helpers/checkDocumentGroup';

interface Props {
  documentRevision: DocumentRevision
  docRevId: string
  status?: DocumentRevisionStatus
  revisionChangeType: string
  currentDocumentType?: DocumentType
  renderAsButton?: boolean
  hasBuildType?: boolean
  isWO?: boolean
  isWOForm?: boolean
}

export interface IItem {
  docId: string
  displayRevision: string
  phase: string
}

export interface IApprovalErrorResponse {
  msgs: string[]
  isWarning: boolean
  isError: boolean
  itemsAsOfferingNotApproved: Array<{docId: string, displayRevision: string}>
  errorItems: IItem[]
  warningItems: IItem[]
}

export const SubmitForApproval: React.FunctionComponent<Props> = ({
  documentRevision,
  docRevId,
  status,
  revisionChangeType,
  currentDocumentType,
  renderAsButton,
  hasBuildType,
  isWO,
  isWOForm,
}) => {
  const isNewLayout = SM.isNewLayout;
  const dispatch = useDispatch();
  const dialog = useDialog();
  const supplierStatusDialog = useDialog();
  const applyTransition = useActionCreator(documentRevisionsActions.applyTransition);
  const isEquipment = checkIsDocumentEquipment(currentDocumentType?.groupOptions);
  const isObsolete = isEquipment ? false : revisionChangeType === RevisionChangeType.Obsolete;
  const isTypeMpiOutput = checkIsDocumentMPIOutput(currentDocumentType?.groupOptions);
  const isLhrDoc = checkIsDocumentLHR(currentDocumentType?.groupOptions);
  let label = isTypeMpiOutput ? 'record.complete.step' : 'record.submit.for.approval';

  const [errorResponse, setErrorResponse] = useState<IApprovalErrorResponse>();

  if (isWO && !isWOForm) {
    label = 'record.assign';
  }

  const releaseAsync = useAsync({
    onError: (error) => {
      try {
        const parsedError = JSON.parse(error as string);
        if (parsedError.status === 412 && parsedError.response) {
          setErrorResponse(parsedError.response as IApprovalErrorResponse);
          supplierStatusDialog.open();
        } else {
          toastError(error as string);
          dialog.close();
        }
      } catch (error) {
        toastError(error as string);
        dialog.close();
      }
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

  const releaseRecord = (event?, ignoreWarning?: boolean) => {
    if (!hasBuildType && isLhrDoc) {
      toastError(translate('form.builder.lhr.build.type.error.message'));
      return;
    }
    releaseAsync.start(
      applyTransition,
      docRevId,
      ignoreWarning ?? false,
      'in_review',
      releaseAsync,
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
      {documentRevision && (
        <VoidAlertDialog
          dialog={dialog}
          documentRevision={documentRevision}
          async={updateDocAsync}
          voidAction={documentRevisionsActions.save}
        />
      )}
      {errorResponse && (
        <SupplierStatusDialog
          dialog={supplierStatusDialog}
          data={errorResponse}
          confirmAction={e => releaseRecord(e, true)} />
      )}
    </>
  );
};

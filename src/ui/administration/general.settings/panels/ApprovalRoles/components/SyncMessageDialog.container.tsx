import { Box } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SM } from '../../../../../../App';
import { translate } from '../../../../../../common/intl';
import { authSelectors } from '../../../../../../state/ducks/auth';
import { companyActions, companySelectors } from '../../../../../../state/ducks/company';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import Text from '../../../../../components/Text';
import { isDocumentRevisionCanceled, isDocumentRevisionInStatus, isDocumentRevisionReleased } from '../../../../../documentRevision/helpers/documentRevisionStatus';
import { FBDAMFields } from '../../../../../form.builder';
import { FBApprovalRole } from '../../../../../form.builder/FBApprovalMatrixField/FBApprovalMatrixField.types';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import SyncMessageAlert from './SyncMessageAlert';
import SyncMessageDialog from './SyncMessageDialog';

const SyncLabelElement: React.FC<{ label?: string, subLabel?: string }> = ({ label, subLabel }) => {
  return (
    <>
      <Text message={label} />
      <Box marginTop={2} >
        <Text message={subLabel} />
      </Box>
    </>
  );
};

interface Props {
  documentRevision: DocumentRevision
  reloadComponent?: () => void
}

type DarFormInput = FBApprovalRole[] | undefined;

const SyncMessageDialogContainer: React.FC<Props> = ({
  documentRevision,
  reloadComponent,
}) => {
  const { _documentRevisionFormState } = SM.useStores();
  const { formInput } = documentRevision;
  const { approvalRoles: approvalRolesState } = useSelector(companySelectors.getGeneralSettings);
  const { removeFromDam, addToDam, dam } = approvalRolesState;
  const damIsSynced = dam?.isSynced ?? true;
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const dispatch = useDispatch();
  const isDraftOrPending = isDocumentRevisionInStatus([DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange], documentRevision.status);
  const isCancelled = isDocumentRevisionCanceled(documentRevision.status);
  const alertDialog = useDialog();
  const needsSyncMessage = isOwner && !damIsSynced;
  const needsAlertMessage = needsSyncMessage
    && dam?.document?.id === documentRevision.documentId
    && !isDraftOrPending
    && !isCancelled;
  const needsDialogMessage = needsSyncMessage
    && dam?.documentRevision?.id === documentRevision.id
    && isDraftOrPending;
  const [isDialogMessageOpen, setIsDialogMessageOpen] = React.useState(needsDialogMessage);

  const rolesAddedList = addToDam.map(item => item.name).join(', ');
  const rolesRemovedList = removeFromDam.map(item => item.name).join(', ');
  const isRolesAdded = addToDam.length > 0;
  const isRolesRemoved = removeFromDam.length > 0;

  useEffect(() => {
    if (documentRevision.id) {
      dispatch(companyActions.getGeneralSettings());
    }
  }, [documentRevision.id]);

  useEffect(() => {
    setIsDialogMessageOpen(needsDialogMessage);
  }, [needsDialogMessage]);

  useEffect(() => {
    if (needsAlertMessage) {
      alertDialog.open();
    }
  }, [needsAlertMessage]);

  const getSyncMessageTranslation = (isSubLabel = false): string | undefined => {
    if (isRolesAdded && isRolesRemoved) {
      const key = isSubLabel ? 'dam.sync.message.role.added.removed.sub.label' : 'dam.sync.message.role.added.removed.label';
      return translate(key, {
        roleAdded: addToDam.length,
        addedList: rolesAddedList,
        roleRemoved: removeFromDam.length,
        rolesCount: removeFromDam.length,
        removedlist: rolesRemovedList,
      });
    }

    if (isRolesAdded) {
      const key = isSubLabel ? 'dam.sync.message.role.added.sub.label' : 'dam.sync.message.role.added.label';
      return translate(key, {
        rolesCount: addToDam.length,
        addedList: rolesAddedList,
      });
    }

    if (isRolesRemoved) {
      const key = isSubLabel ? 'dam.sync.message.role.removed.sub.label' : 'dam.sync.message.role.removed.label';
      return translate(key, {
        rolesCount: removeFromDam.length,
        removedlist: rolesRemovedList,
      });
    }
  };

  const getSyncLabel = () => {
    if (isDraftOrPending) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel={getSyncMessageTranslation(true)}
        />
      );
    }

    if (isDocumentRevisionInStatus([DocumentRevisionStatus.InReview, DocumentRevisionStatus.Approved], documentRevision.status)) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel={translate('dam.sync.message.in.review.role.sub.label', {
            docId: dam.document.docId,
          })}
        />
      );
    }

    if (isDocumentRevisionReleased(documentRevision.status)) {
      return (
        <SyncLabelElement
          label={getSyncMessageTranslation()}
          subLabel="dam.sync.message.released.role.sub.label"
        />
      );
    }
  };

  const setDocumentRevision = useActionCreator(documentRevisionsActions.save);
  const async = useAsync({
    onSuccess: () => dispatch(companyActions.getGeneralSettings()),
  });

  const handleConfirm = () => {
    setIsDialogMessageOpen(false);

    if (!isDraftOrPending) {
      return;
    }

    const darFormInput = formInput?.[FBDAMFields.DAR] as DarFormInput;
    const existingDar = cloneDeep(darFormInput ?? []);
    const updatedDar = [...existingDar, ...addToDam]
      .filter(item => !removeFromDam.some(removeItem => removeItem.id === item.id))
      .sort((a, b) => a.index - b.index);

    documentRevision.formInput = { ...formInput, [FBDAMFields.DAR]: updatedDar };
    _documentRevisionFormState?.setDocumentRevision(documentRevision);
    async.start(setDocumentRevision, documentRevision.id, { formInput: documentRevision.formInput }, async);
    reloadComponent?.();
  };

  if (needsAlertMessage) {
    return (
      <SyncMessageAlert
        alertDialog={alertDialog}
        dialogContent={getSyncLabel()}
      />
    );
  }

  if (needsDialogMessage) {
    return (
      <SyncMessageDialog
        isOpen={isDialogMessageOpen}
        onConfirm={handleConfirm}
        dialogContent={getSyncLabel()}
        dam={dam}
      />
    );
  }

  return null;
};

export default SyncMessageDialogContainer;

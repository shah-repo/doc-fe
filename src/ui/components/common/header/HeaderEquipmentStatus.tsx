import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus, EquipmentStatus } from '../../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import { isDocumentRevisionInStatus } from '../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { Translation } from '../../../translations/types';
import HeaderStatusButton from './HeaderStatusButton';

interface Props {
  documentRevision: DocumentRevision
}

const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];
const options = Object.values(EquipmentStatus).map(value => ({
  value,
  label: value,
}));

const HeaderEquipmentStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateEquipmentStatusAction = useActionCreator(documentRevisionsActions.updateEquipmentStatus);

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermissionToChangeEquipmentStatus = useSelector(getHasPermission(Permission.EDIT_EQ_STATUS));
  const isVoidedOrObsolete = isDocumentRevisionInStatus([DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided], documentRevision.status);
  const canChangeEquipmentStatus = (isOwner || hasPermissionToChangeEquipmentStatus) && (!disabledStatuses.includes(documentRevision.status));
  const isEquipmentStatusEditable = canChangeEquipmentStatus && !isVoidedOrObsolete;
  const statusLabel = documentRevision.eqStatus || EquipmentStatus.Inactive;
  const [draftEquipmentStatus, setDraftEquipmentStatus] = React.useState(statusLabel);

  const handleEqStatusChange = (equipmentStatus) => {
    if (equipmentStatus === statusLabel) {
      return;
    }
    setDraftEquipmentStatus(equipmentStatus);
    confirmationDialog.open();
  };

  const confirmationMessage = translate(
    'documentRevision.equipment.status.update.alert',
    {
      oldStatus: (<b>{statusLabel}</b>) as unknown as string,
      newStatus: (<b>{draftEquipmentStatus}</b>) as unknown as string,
    },
  );

  const confirmUpdate = () => {
    async.start(updateEquipmentStatusAction, documentRevision.id, { eqStatus: draftEquipmentStatus }, async);
  };

  return (
    <>
      <HeaderStatusButton
        onItemSelect={handleEqStatusChange}
        label={statusLabel}
        options={options}
        disabled={!isEquipmentStatusEditable}
        data-cy="equipment-status"
      />
      <AlertDialog
        title="documentRevision.equipment.status.update.alert.title"
        confirmAction={confirmUpdate}
        message={confirmationMessage as Translation}
        dialog={confirmationDialog}
        confirmLabel="common.true"
        cancelLabel="common.false"
      />
    </>
  );
};

export default withThemeNext(HeaderEquipmentStatus);

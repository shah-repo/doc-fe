import { capitalize, kebabCase, noop } from 'lodash';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus, EquipmentStatus } from '../../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { Translation } from '../../../translations/types';
import HeaderStatusButton from './HeaderStatusButton';

interface Props {
  documentRevision: DocumentRevision
}

export const getEquipmentStatusLabel = (status: EquipmentStatus): string =>
  translate(`form.builder.header.equipment.status.label.${kebabCase(status)}`);

const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];
const options = Object.values(EquipmentStatus).map(value => ({
  value,
  label: getEquipmentStatusLabel(value),
}));

const HeaderEquipmentStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateEquipmentStatusAction = useActionCreator(documentRevisionsActions.updateEquipmentStatus);

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermisstionToChangeEquipmentStatus = useSelector(getHasPermission(Permission.EDIT_EQ_STATUS));
  const isStatusInReleased = documentRevision.displayStatus === capitalize(DocumentRevisionStatus.Released);
  const canChangeEquipmentStatus = isOwner || hasPermisstionToChangeEquipmentStatus;
  const canEquipmentStatusBeChanged = !disabledStatuses.includes(documentRevision.status);
  const isEquipmentStatusEditable = canChangeEquipmentStatus && canEquipmentStatusBeChanged && isStatusInReleased;

  const statusLabel = getEquipmentStatusLabel(documentRevision.equipmentStatus || EquipmentStatus.INACTIVE);

  const updateEquipmentStatus = useRef<() => void>();
  const nextStatus = useRef<EquipmentStatus>();
  
  const confirmUpdate = (equipmentStatus: EquipmentStatus) => {
    if(getEquipmentStatusLabel(equipmentStatus) === statusLabel) {
      return;
    }
    nextStatus.current = equipmentStatus;
    updateEquipmentStatus.current = () => {
      async.start(updateEquipmentStatusAction, documentRevision.id, { equipmentStatus }, async);
    };
    confirmationDialog.open();
  };

  const confirmationMessage = translate(
    'documentRevision.equipment.status.update.alert',
    { oldStatus: <b>{getEquipmentStatusLabel(statusLabel as EquipmentStatus)}</b>, newStatus: <b>{getEquipmentStatusLabel(nextStatus.current as EquipmentStatus) }</b> },
  );

  return (
    <>
      <HeaderStatusButton
        onItemSelect={confirmUpdate}
        label={statusLabel}
        options={options}
        disabled={!isEquipmentStatusEditable}
        data-cy="equipment-status"
      />
      <AlertDialog
        title="documentRevision.equipment.status.update.alert.title"
        confirmAction={updateEquipmentStatus.current ?? noop}
        message={confirmationMessage as Translation}
        dialog={confirmationDialog}
        confirmLabel="common.true"
        cancelLabel="common.false"
      />
    </>
  );
};

export default withThemeNext(HeaderEquipmentStatus);

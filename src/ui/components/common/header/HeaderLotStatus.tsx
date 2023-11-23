import { kebabCase, noop } from 'lodash';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus, LotStatus } from '../../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../../app/alert.dialog/AlertDialog';
import FBDataStore from '../../../form.builder/FBStore/FBDataStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { Translation } from '../../../translations/types';
import HeaderStatusButton from './HeaderStatusButton';

interface Props {
  documentRevision: DocumentRevision
}

export const getLotStatusLabel = (status: LotStatus): string =>
  translate(`form.builder.header.lot.status.label.${kebabCase(status)}`);

const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];
const options = Object.values(LotStatus).filter(status => status !== LotStatus.VOIDED).map(value => ({
  value,
  label: getLotStatusLabel(value),
}));

const HeaderLotStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateLotStatusAction = useActionCreator(documentRevisionsActions.updateLotStatus);

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermisstionToChangeLotStatus = useSelector(getHasPermission(Permission.EDIT_LOT_STATUS));
  const canChangeLotStatus = isOwner || hasPermisstionToChangeLotStatus;
  const canLotStatusBeChanged = !disabledStatuses.includes(documentRevision.status);
  const isLotStatusEditable = canChangeLotStatus && canLotStatusBeChanged;

  const statusLabel = getLotStatusLabel(
    FBDataStore?.refreshData?.lotStatus === LotStatus.SCRAP
      ? FBDataStore?.refreshData?.lotStatus
      : documentRevision.lotStatus,
  );

  const updateLotStatus = useRef<() => void>();
  const nextStatus = useRef<LotStatus>();

  const confirmUpdate = (lotStatus: LotStatus) => {
    nextStatus.current = lotStatus;
    updateLotStatus.current = () => {
      async.start(updateLotStatusAction, documentRevision.id, { lotStatus }, async);
    };
    confirmationDialog.open();
  };

  const confirmationMessage = translate(
    'documentRevision.lot.status.update.alert',
    { status: getLotStatusLabel(nextStatus.current as LotStatus) },
  );

  return (
    <>
      <HeaderStatusButton
        onItemSelect={confirmUpdate}
        label={statusLabel}
        options={options}
        disabled={!isLotStatusEditable}
        data-cy="lot-status"
      />
      <AlertDialog
        confirmAction={updateLotStatus.current ?? noop}
        message={confirmationMessage as Translation}
        dialog={confirmationDialog}
      />
    </>
  );
};

export default withThemeNext(HeaderLotStatus);

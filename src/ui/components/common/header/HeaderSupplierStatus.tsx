import { kebabCase, noop } from 'lodash';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus, SupplierStatus } from '../../../../state/ducks/documentRevisions/types';
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

const getSupplierStatusLable = (status?: SupplierStatus): string =>
  translate(`form.builder.header.supplier.status.label.${kebabCase(status)}`);

const options = Object.values(SupplierStatus).map(value => ({
  value,
  label: getSupplierStatusLable(value),
}));
const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];

const HeaderSupplierStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateSupplierStatusAction = useActionCreator(documentRevisionsActions.updateSupplierStatus);

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermissionToUpdateSupplierStatus = useSelector(getHasPermission(Permission.EDIT_SUPPLIER_STATUS));
  const isSupplierStatusEditable = (isOwner || hasPermissionToUpdateSupplierStatus) && (!disabledStatuses.includes(documentRevision.status));

  const statusLabel = getSupplierStatusLable(documentRevision.supplierStatus);

  const updateLotStatus = useRef<() => void>();
  const nextStatus = useRef<SupplierStatus>();

  const confirmUpdate = (supplierStatus: SupplierStatus) => {
    nextStatus.current = supplierStatus;
    updateLotStatus.current = () => {
      async.start(updateSupplierStatusAction, documentRevision.id, { supplierStatus }, async);
    };
    confirmationDialog.open();
  };

  const confirmationMessage = translate(
    'form.builder.supplier.status.update.alert',
    { status: getSupplierStatusLable(nextStatus.current as SupplierStatus) },
  );

  return (
    <>
      <HeaderStatusButton
        onItemSelect={confirmUpdate}
        label={statusLabel}
        options={options}
        disabled={!isSupplierStatusEditable}
        data-cy="supplier-status"
      />
      <AlertDialog
        confirmAction={updateLotStatus.current ?? noop}
        message={confirmationMessage as Translation}
        dialog={confirmationDialog}
      />
    </>
  );
};

export default withThemeNext(HeaderSupplierStatus);

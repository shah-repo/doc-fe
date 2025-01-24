import { noop } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission } from '../../../../common/utils/selectors';
import { authSelectors } from '../../../../state/ducks/auth';
import { Permission } from '../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { AlertDialog } from '../../dialogs';
import { OptionType } from '../../forms/fields/Autocomplete/types';
import { toastError } from '../../notifications';
import HeaderStatusButton from './HeaderStatusButton';

interface Props {
  documentRevision: DocumentRevision
}

const disabledStatuses = [DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Voided];

const HeaderSupplierStatus: React.FC<Props> = ({ documentRevision }) => {
  const confirmationDialog = useDialog();
  const async = useAsync({
    onSuccess: confirmationDialog.close,
  });
  const updateSupplierStatusAction = useActionCreator(documentRevisionsActions.updateSupplierStatus);

  const [options, setOptions] = useState<OptionType[]>([]);
  const fetchASLTypes = useActionCreator(documentRevisionsActions.fetchASLSuppliersListData);

  const supplierTypesAsync = useAsync<ASLStatus[]>({
    onSuccess: (aslStatusList) => {
      setOptions(aslStatusList?.map((data) => { return { label: data.displayLabel, value: data.id }; }) ?? []);
    },
    onError: toastError,
  });

  useEffect(() => {
    supplierTypesAsync.start(fetchASLTypes, supplierTypesAsync);
  }, []);

  const getSupplierStatusByValue = (supplierStatus?: string) => {
    return options?.find((data) => data.value === supplierStatus)?.label;
  };

  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = documentRevision.owner.user.id === currentUserId;
  const hasPermissionToUpdateSupplierStatus = useSelector(getHasPermission(Permission.EDIT_SUPPLIER_STATUS));
  const isSupplierStatusEditable = (isOwner || hasPermissionToUpdateSupplierStatus) && (!disabledStatuses.includes(documentRevision.status));

  const statusLabel = getSupplierStatusByValue(documentRevision.supplierStatusId);

  const updateLotStatus = useRef<() => void>();
  const nextStatus = useRef<string>();

  const confirmUpdate = (supplierStatus: string) => {
    nextStatus.current = options?.find((data) => data.value === supplierStatus)?.label;
    updateLotStatus.current = () => {
      async.start(updateSupplierStatusAction, documentRevision.id, { supplierStatusId: supplierStatus }, async);
    };
    confirmationDialog.open();
  };

  const confirmationMessage = translate(
    'form.builder.supplier.status.update.alert',
    { status: nextStatus.current },
  );

  return (
    <>
      <HeaderStatusButton
        onItemSelect={confirmUpdate}
        label={statusLabel ?? ''}
        options={options}
        disabled={!isSupplierStatusEditable}
        data-cy="supplier-status"
      />
      <AlertDialog
        handler={confirmationDialog}
        onConfirm={updateLotStatus.current ?? noop}
      >
        {confirmationMessage}
      </AlertDialog>
    </>
  );
};

export default withThemeNext(HeaderSupplierStatus);

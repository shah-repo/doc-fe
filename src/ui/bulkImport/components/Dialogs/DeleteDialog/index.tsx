import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { AlertDialog } from '../../../../components/dialogs';
import { DialogHandler } from '../../../../hooks/useDialog';

interface BulkImportProgressProps {
  handler: DialogHandler
  handleConfirm?: () => void
  handleClose?: () => void
}

const DeleteDialog: React.FC<BulkImportProgressProps> = ({
  handler,
  handleConfirm = noop,
  handleClose = noop,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (handler.isOpen) {
      setIsLoading(false);
    }
  }, [handler.isOpen]);

  const onConfirm = () => {
    setIsLoading(true);
    handleConfirm();
  };

  return (
    <AlertDialog
      handler={handler}
      cancelLabel="common.no.go.back"
      onConfirm={onConfirm}
      onCancel={handleClose}
      loading={isLoading}
    >
      <p>{translate('bulkImport.deleteDialogDescription')}</p>
      <p>{translate('bulkImport.areYouSureWantToContinue')}</p>
    </AlertDialog>
  );
};

export default DeleteDialog;

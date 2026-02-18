import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { FB } from '..';
import { toastError } from '../../components/notifications';
import useDialog from '../../hooks/useDialog';
import { withThemeNext } from '../../layout/theme-next';
import FBSerialsTable from '../FBSerialsTable';
import AddDialog from './components/AddDialog';
import ImportDialog from './components/ImportDialog';
import useStyles from './styles';
import { SerialNumberUpdateData, SerialNumberUpdatePayload } from './types';

const FBSerials: React.FC = () => {
  const classes = useStyles();
  const { serialsState } = FB.useStores();
  const addDialog = useDialog();
  const importDialog = useDialog();

  useEffect(() => {
    serialsState?.load();
  }, [serialsState]);

  const {
    partName,
    partDescription,
    isPartSerialized,
    isPartSerializationManual,
  } = useObserver(() => ({
    partName: serialsState?.part?.name,
    partDescription: serialsState?.part?.description,
    isPartSerialized: serialsState?.isPartSerialized,
    isPartSerializationManual: serialsState?.isPartSerializationManual,
  }));

  const serialNumbers = useObserver(() => serialsState?.serialNumbers ?? []);
  const isLoading = useObserver(() => serialsState?.isLoading);

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, data);
  };

  const deleteSerialNumber = async (id: string) => {
    await serialsState?.deleteSerialNumber(id);
  };

  const bulkUpdateSerialNumbers = async (payload: SerialNumberUpdatePayload[]) => {
    await serialsState?.updateSerialNumbers(payload);
  };

  const bulkDeleteSerialNumbers = async (ids: string[]) => {
    await serialsState?.deleteSerialNumbers(ids);
  };

  const addSerials = async (serials: string[]) => {
    try {
      await serialsState?.createSerialNumbers(serials);
    } catch (error) {
      toastError('Failed to add serial numbers');
    }
  };

  if (!isPartSerialized) {
    return null;
  }

  const actionProps = isPartSerializationManual ? {
    onUpdate: updateSerialNumber,
    onDelete: deleteSerialNumber,
    onBulkUpdate: bulkUpdateSerialNumbers,
    onBulkDelete: bulkDeleteSerialNumbers,
    onImport: importDialog.open,
    onAdd: addDialog.open,
  } : {};

  return (
    <div className={classes.root}>
      <FBSerialsTable
        serialNumbers={serialNumbers}
        isLoading={isLoading}
        {...actionProps}
      />
      {isPartSerializationManual && (
        <>
          <AddDialog
            isOpen={addDialog.isOpen}
            onClose={addDialog.close}
            onConfirm={addSerials}
          />
          <ImportDialog
            partName={partName}
            partDescription={partDescription}
            isOpen={importDialog.isOpen}
            onClose={importDialog.close}
            onConfirm={addSerials}
          />
        </>
      )}
    </div>
  );
};

export default withThemeNext(FBSerials);

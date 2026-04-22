import { useObserver } from 'mobx-react';
import React, { useEffect } from 'react';
import { FB, FBSection } from '..';
import { translate } from '../../../common/intl';
import { toastError } from '../../components/notifications';
import useDialog from '../../hooks/useDialog';
import { useFormValue } from '../../hooks/useFormValue';
import { withThemeNext } from '../../layout/theme-next';
import FBSerialsTable from '../FBSerialsTable';
import AddDialog from './components/AddDialog';
import { LOT_PART_SELECT_KEY, LOT_QUANTITY_SELECT_KEY } from './helpers';
import useStyles from './styles';
import { SerialNumberUpdateData, SerialNumberUpdatePayload } from './types';

const FBSerials: React.FC = () => {
  const classes = useStyles();
  const { serialsState } = FB.useStores();
  const addDialog = useDialog();
  const importDialog = useDialog();

  const lotPart = useFormValue(LOT_PART_SELECT_KEY);
  const lotQuantity = useFormValue(LOT_QUANTITY_SELECT_KEY);

  useEffect(() => {
    serialsState?.reload();
  }, [lotPart, serialsState]);

  useEffect(() => {
    if (serialsState?.shouldShowSerials) {
      serialsState?.reload();
    }
  }, [lotQuantity, serialsState]);

  const {
    shouldShowSerials,
    isPartSerializationManual,
  } = useObserver(() => ({
    shouldShowSerials: serialsState?.shouldShowSerials,
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
      toastError(translate('form.builder.serials.failed.to.add'));
    }
  };

  if (!shouldShowSerials) {
    return null;
  }

  const defaultActionProps = {
    onUpdate: updateSerialNumber,
    onBulkUpdate: bulkUpdateSerialNumbers,
  };

  const actionProps = isPartSerializationManual ? {
    ...defaultActionProps,
    onDelete: deleteSerialNumber,
    onBulkDelete: bulkDeleteSerialNumbers,
    onImport: importDialog.open,
    onAdd: addDialog.open,
  } : defaultActionProps;

  return (
    <div className={classes.root}>
      <FBSection label="form.builder.serials.title" />
      <FBSerialsTable
        serialNumbers={serialNumbers}
        isLoading={isLoading}
        {...actionProps}
      />
      {isPartSerializationManual && (
        <AddDialog
          isOpen={addDialog.isOpen}
          onClose={addDialog.close}
          onConfirm={addSerials}
        />
      )}
    </div>
  );
};

export default withThemeNext(FBSerials);

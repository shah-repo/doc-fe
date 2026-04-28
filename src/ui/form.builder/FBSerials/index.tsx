import { useObserver } from 'mobx-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FB, FBSection } from '..';
import { translate } from '../../../common/intl';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { ApplicationState } from '../../../state/reducers';
import { toastError } from '../../components/notifications';
import useDialog from '../../hooks/useDialog';
import { useFormValue } from '../../hooks/useFormValue';
import useMqttSubscription from '../../hooks/useMqttSubscription';
import { withThemeNext } from '../../layout/theme-next';
import FBSerialsTable from '../FBSerialsTable';
import FBStore from '../FBStore/FBStore';
import AddDialog from './components/AddDialog';
import { LOT_PART_SELECT_KEY, LOT_QUANTITY_SELECT_KEY, LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS } from './helpers';
import useStyles from './styles';
import { SerialNumberUpdateData, SerialNumberUpdatePayload } from './types';

const FBSerials: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { serialsState, workspaceState, formState } = FB.useStores();
  const addDialog = useDialog();
  const importDialog = useDialog();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lotId = useObserver(() => workspaceState?.document?.id);
  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(
      state,
      lotId ?? '',
    ),
  );
  const shouldReload = useRef(false);
  const lotPart = useFormValue<string>(LOT_PART_SELECT_KEY);
  const lotQuantity = useFormValue<number>(LOT_QUANTITY_SELECT_KEY);

  useEffect(() => {
    if (lotPart) {
      serialsState?.reload();
    }
  }, [documentRevision, serialsState]);

  useMqttSubscription(
    `+/lot_serial_numbers/${lotId}/updated`,
    () => {
      if (shouldReload.current) {
        shouldReload.current = false;
        formState?.unlockFields(LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS);
        serialsState?.reload();
      }
    },
  );

  const lockFields = useCallback(() => {
    shouldReload.current = true;
    formState?.lockFields(LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS);
  }, [formState]);

  useEffect(() => {
    if (serialsState?.shouldShowSerials && shouldReload.current) {
      lockFields();
    }
  }, [lotQuantity, lotPart, lockFields, serialsState]);

  const {
    shouldShowSerials,
    isPartSerializationManual,
  } = useObserver(() => ({
    shouldShowSerials: serialsState?.shouldShowSerials,
    isPartSerializationManual: serialsState?.isPartSerializationManual,
  }));

  const serialNumbers = useObserver(() => serialsState?.serialNumbers ?? []);
  const isLoading = useObserver(() => serialsState?.isLoading);

  const reloadAudit = () => {
    const lotId = serialsState?.lotId;
    if (lotId && FBStore.isHistoryTabSelected) {
      dispatch(documentRevisionsActions.loadAudit(lotId));
    }
  };

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, data);
    reloadAudit();
  };

  const deleteSerialNumber = async (id: string) => {
    await serialsState?.deleteSerialNumber(id);
    reloadAudit();
  };

  const bulkUpdateSerialNumbers = async (payload: SerialNumberUpdatePayload[]) => {
    await serialsState?.updateSerialNumbers(payload);
    reloadAudit();
  };

  const bulkDeleteSerialNumbers = async (ids: string[]) => {
    await serialsState?.deleteSerialNumbers(ids);
    reloadAudit();
  };

  const addSerials = async (serials: string[]) => {
    try {
      await serialsState?.createSerialNumbers(serials);
      reloadAudit();
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
      <FBSection label="form.builder.serials.title">
        <div ref={toolbarRef} className={classes.toolbar} />
      </FBSection>
      <FBSerialsTable
        serialNumbers={serialNumbers}
        isLoading={isLoading}
        toolbarRef={toolbarRef}
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

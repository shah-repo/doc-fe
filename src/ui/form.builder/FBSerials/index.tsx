import { useObserver } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FB, FBSection } from '..';
import { SM } from '../../../App';
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
import { DEFAULT_LOT_ID, LOT_PART_SELECT_KEY, LOT_QUANTITY_SELECT_KEY, LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS } from './consts';
import useStyles from './styles';
import { FBSerialsProps, SerialNumberUpdateData, SerialNumberUpdatePayload } from './types';

const FBSerials: React.FC<FBSerialsProps> = ({
  disabled = false,
  name = '',
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { serialsState, workspaceState, formState } = FB.useStores();
  const { _documentRevisionFormState } = SM.useStores();
  const addDialog = useDialog();
  const importDialog = useDialog();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lotId = useObserver(() => workspaceState?.document?.id ?? DEFAULT_LOT_ID);
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
    if (documentRevision?.formInput?.[LOT_PART_SELECT_KEY] && !_documentRevisionFormState?.loading) {
      serialsState?.reload();
    } else {
      _documentRevisionFormState?.setLoading(false);
    }
  }, [documentRevision, serialsState, _documentRevisionFormState]);

  useMqttSubscription(
    `+/lot_serial_numbers/${lotId}/updated`,
    () => {
      if (shouldReload.current) {
        shouldReload.current = false;
        formState?.unlockFields([...LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS, name]);
        serialsState?.reload();
      }
    },
  );

  const lockFields = useCallback(() => {
    shouldReload.current = true;
    formState?.lockFields([...LOT_SERIAL_NUMBERS_LOCKABLE_FIELDS, name]);
  }, [formState, name]);

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

  const updateWorkspace = useCallback(() => {
    const lotId = serialsState?.lotId;
    if (lotId) {
      _documentRevisionFormState?.setLoading(true);
      dispatch(documentRevisionsActions.reload(lotId));
      if (FBStore.isHistoryTabSelected) {
        dispatch(documentRevisionsActions.loadAudit(lotId));
      }
    }
  }, [dispatch, _documentRevisionFormState, serialsState]);

  const updateSerialNumber = useCallback(async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, data);
    updateWorkspace();
  }, [updateWorkspace, serialsState]);

  const deleteSerialNumber = useCallback(async (id: string) => {
    await serialsState?.deleteSerialNumber(id);
    updateWorkspace();
  }, [updateWorkspace, serialsState]);

  const bulkUpdateSerialNumbers = useCallback(async (payload: SerialNumberUpdatePayload[]) => {
    await serialsState?.updateSerialNumbers(payload);
    updateWorkspace();
  }, [updateWorkspace, serialsState]);

  const bulkDeleteSerialNumbers = useCallback(async (ids: string[]) => {
    await serialsState?.deleteSerialNumbers(ids);
    updateWorkspace();
  }, [updateWorkspace, serialsState]);

  const addSerials = useCallback(async (serials: string[]) => {
    try {
      await serialsState?.createSerialNumbers(serials);
      updateWorkspace();
    } catch (error) {
      toastError(translate('form.builder.serials.failed.to.add'));
    }
  }, [updateWorkspace, serialsState]);

  const defaultActionProps = useMemo(() => ({
    onUpdate: updateSerialNumber,
    onBulkUpdate: bulkUpdateSerialNumbers,
  }), [bulkUpdateSerialNumbers, updateSerialNumber]);

  const actionProps = useMemo(() => (isPartSerializationManual ? {
    ...defaultActionProps,
    onDelete: deleteSerialNumber,
    onBulkDelete: bulkDeleteSerialNumbers,
    onImport: importDialog.open,
    onAdd: addDialog.open,
  } : defaultActionProps), [
    addDialog.open,
    bulkDeleteSerialNumbers,
    defaultActionProps,
    deleteSerialNumber,
    importDialog.open,
    isPartSerializationManual,
  ]);

  const checkExistingSerialNumbers = useCallback(async (serials: string[]) => {
    if (!serialsState) {
      return [];
    }

    return await serialsState.checkExistingLotSerialNumbers(serials);
  }, [serialsState]);

  if (!shouldShowSerials) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FBSection label="form.builder.serials.title">
        <div ref={toolbarRef} className={classes.toolbar} />
      </FBSection>
      <FBSerialsTable
        isDisabled={disabled}
        serialNumbers={serialNumbers}
        isLoading={isLoading}
        toolbarRef={toolbarRef}
        {...actionProps}
      />
      {isPartSerializationManual && !disabled && (
        <AddDialog
          isOpen={addDialog.isOpen}
          onClose={addDialog.close}
          onConfirm={addSerials}
          onCheckExistingSerialNumbers={checkExistingSerialNumbers}
        />
      )}
    </div>
  );
};

export default withThemeNext(FBSerials);

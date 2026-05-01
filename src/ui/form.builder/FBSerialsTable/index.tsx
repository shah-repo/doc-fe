import { process, State } from '@progress/kendo-data-query';
import { getSelectedState, GridDataStateChangeEvent, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { isNull, keys } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { EditableSerialNumber, SerialNumberStatus } from '../FBSerials/types';
import SerialsToolbar from './components/SerialsToolbar';
import { DATA_ITEM_KEY, DEFAULT_DATA_STATE, PANELS_HEIGHT, ROW_HEIGHT, SELECTED_FIELD, SERIAL_NUMBER_FIELD } from './const';
import { compareSerialNumbers, getSerialNumberSort, getSharedSerialNumberPart, getStateWithoutSerialNumberSort } from './helpers';
import { useSchema } from './schema';
import useStyles from './styles';
import { FBSerialsTableProps, SerialNumberSortDescriptor } from './types';

const FBSerialsTable: React.FC<FBSerialsTableProps> = ({
  serialNumbers,
  isLoading,
  toolbarRef,
  onAdd,
  onUpdate,
  onDelete,
  onBulkUpdate,
  onBulkDelete,
}) => {
  const classes = useStyles();
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});
  const [dataState, setDataState] = useState<State>(DEFAULT_DATA_STATE);
  const sharedSerialNumberPart = useMemo(() => getSharedSerialNumberPart(serialNumbers), [serialNumbers]);
  const selectedIds = useMemo(() => keys(selectedSerials).filter(sn => selectedSerials[sn]), [selectedSerials]);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = hasSelection && selectedIds.length === serialNumbers.length;

  const acceptSelected = useCallback(async () => {
    const payload = selectedIds.map(id => ({ id, status: SerialNumberStatus.ACCEPTED }));
    await onBulkUpdate?.(payload);
    setSelectedSerials({});
  }, [onBulkUpdate, selectedIds]);

  const rejectSelected = useCallback(async () => {
    await onBulkUpdate?.(selectedIds.map(id => ({ id, status: SerialNumberStatus.REJECTED })));
    setSelectedSerials({});
  }, [onBulkUpdate, selectedIds]);

  const deleteSelected = useCallback(async () => {
    await onBulkDelete?.(selectedIds);
    setSelectedSerials({});
  }, [onBulkDelete, selectedIds]);

  const toggleAllSelection = useCallback((event: CheckboxChangeEvent) => {
    if (event.target.value) {
      setSelectedSerials(serialNumbers.reduce((acc, sn) => ({ ...acc, [sn.id]: true }), {}));
    } else {
      setSelectedSerials({});
    }
  }, [serialNumbers]);

  const clearSelection = useCallback(() => setSelectedSerials({}), []);

  const toggleSelection = useCallback((event: GridSelectionChangeEvent) => {
    const dataItem = event.dataItem as EditableSerialNumber | null;
    if (isNull(dataItem)) {
      return;
    }
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedSerials ?? {},
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedSerials(newSelectedState);
  }, [selectedSerials]);

  const updateDataState = useCallback((event: GridDataStateChangeEvent): State => {
    const updatedState: State = {
      ...event.dataState,
      sort: event.dataState.sort?.map((sort): SerialNumberSortDescriptor => {
        if (sort.field === SERIAL_NUMBER_FIELD) {
          return {
            ...sort,
            compare: (first, second) => compareSerialNumbers(
              first.serialNumber,
              second.serialNumber,
              sharedSerialNumberPart,
              sort.dir,
            ),
          };
        }

        return sort;
      }),
    };

    setDataState(updatedState);
    return updatedState;
  }, [sharedSerialNumberPart, setDataState]);

  const schema = useSchema({
    canSelect: Boolean(onBulkUpdate ?? onBulkDelete),
    isAllSelected,
    onCheckAllToggle: toggleAllSelection,
    onUpdate,
    onDelete,
  });

  const data = useMemo<EditableSerialNumber[]>(() => serialNumbers.map(sn => ({
    ...sn,
    [SELECTED_FIELD]: selectedSerials[sn.id],
  })), [selectedSerials, serialNumbers]);

  const processedData = useMemo(() => {
    const processed = process(data, getStateWithoutSerialNumberSort(dataState)).data as EditableSerialNumber[];
    const serialNumberSort = getSerialNumberSort(dataState);

    if (!serialNumberSort?.dir) {
      return processed;
    }

    return [...processed].sort((first, second) => compareSerialNumbers(
      first.serialNumber,
      second.serialNumber,
      sharedSerialNumberPart,
      serialNumberSort.dir,
    ));
  }, [data, dataState, sharedSerialNumberPart]);

  const hasData = processedData.length > 0;

  const shouldShowBulkActions = hasSelection && Boolean(onBulkUpdate ?? onBulkDelete);

  return (
    <>
      <SerialsToolbar
        toolbarRef={toolbarRef}
        selectedCount={selectedIds.length}
        shouldShowBulkActions={shouldShowBulkActions}
        onClearSelection={clearSelection}
        onAcceptSelected={acceptSelected}
        onRejectSelected={rejectSelected}
        onDeleteSelected={onBulkDelete ? deleteSelected : undefined}
      />

      <div className={cx(classes.gridContainer, { [classes.gridContainerEmpty]: !hasData })} style={{ height: processedData.length * ROW_HEIGHT + PANELS_HEIGHT }}>
        <KendoDataGrid<EditableSerialNumber>
          data={processedData}
          schema={schema}
          fullHeight={hasData}
          fullWidth
          filterable
          sortable
          resizable
          hasBoxScrollbars
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          skipDataProcessing
          loading={isLoading}
          {...dataState}
          className={cx(
            classes.grid,
            { [classes.gridWithButton]: onAdd },
          )}
          selectable={{
            enabled: true,
            drag: false,
            cell: false,
            mode: 'multiple',
          }}
          onDataStateChange={updateDataState}
          onSelectionChange={toggleSelection}
        />
      </div>
      {onAdd && (
        <Button
          attached
          fullWidth
          kind="add"
          onClick={onAdd}
        >
          {translate('form.builder.serials.add')}
        </Button>
      )}
    </>
  );
};

export default FBSerialsTable;

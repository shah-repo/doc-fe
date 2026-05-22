import { process, State } from '@progress/kendo-data-query';
import { getSelectedState, GridDataStateChangeEvent, GridPageChangeEvent, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { isNull, keys } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableSerialNumber, SerialNumberStatus } from '../FBSerials/types';
import SerialsToolbar from './components/SerialsToolbar';
import { DATA_ITEM_KEY, DEFAULT_DATA_STATE, PAGE_SIZE, PANELS_HEIGHT, ROW_HEIGHT, SELECTED_FIELD, SERIAL_NUMBER_FIELD } from './const';
import { compareSerialNumbers, getSerialNumberSort, getSharedSerialNumberPart, getStateWithoutSerialNumberSort } from './helpers';
import { useSchema } from './schema';
import useStyles from './styles';
import { FBSerialsTableProps, SerialNumberSortDescriptor } from './types';

const FBSerialsTable: React.FC<FBSerialsTableProps> = ({
  serialNumbers,
  shouldShowStepAndSequence = false,
  isLoading,
  isDisabled: isTableDisabled = false,
  toolbarRef,
  onAdd,
  onUpdate,
  onDelete,
  onBulkUpdate,
  onBulkDelete,
}) => {
  const classes = useStyles();
  const [skippedItemsCount, setSkippedItemsCount] = React.useState<number>(0);
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});
  const [dataState, setDataState] = useState<State>(DEFAULT_DATA_STATE);
  const sharedSerialNumberPart = useMemo(() => getSharedSerialNumberPart(serialNumbers), [serialNumbers]);

  const canInteract = !isTableDisabled;
  const canSelect = canInteract && Boolean(onBulkUpdate ?? onBulkDelete);

  const selectableSerialNumbers = useMemo(
    () => serialNumbers.filter(sn => !sn.isDisabled),
    [serialNumbers],
  );

  const selectedIds = useMemo(() => keys(selectedSerials).filter(sn => selectedSerials[sn]), [selectedSerials]);
  const hasSelection = canSelect && selectedIds.length > 0;
  const isAllSelected = hasSelection
    && selectableSerialNumbers.length > 0
    && selectedIds.length === selectableSerialNumbers.length;

  const shouldShowAddButton = canInteract && Boolean(onAdd);
  const shouldShowBulkActions = canSelect && hasSelection && Boolean(onBulkUpdate ?? onBulkDelete);

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
      setSelectedSerials(selectableSerialNumbers.reduce((acc, sn) => ({ ...acc, [sn.id]: true }), {}));
    } else {
      setSelectedSerials({});
    }
  }, [selectableSerialNumbers]);

  const clearSelection = useCallback(() => setSelectedSerials({}), []);

  useEffect(() => {
    if (isTableDisabled && selectedIds.length > 0) {
      clearSelection();
    }
  }, [clearSelection, isTableDisabled, selectedIds.length]);

  const toggleSelection = useCallback((event: GridSelectionChangeEvent) => {
    const dataItem = event.dataItem as EditableSerialNumber | null;
    if (isNull(dataItem) || dataItem.isDisabled) {
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
    canSelect,
    isAllSelected,
    isTableDisabled,
    shouldShowStepAndSequence,
    onCheckAllToggle: toggleAllSelection,
    onUpdate,
    onDelete,
  });

  const processedData = useMemo(() => {
    const serialNumbersWithSelected = serialNumbers.map(sn => ({
      ...sn,
      [SELECTED_FIELD]: canSelect && !sn.isDisabled ? selectedSerials[sn.id] : false,
    }));
    const processed = process(serialNumbersWithSelected, getStateWithoutSerialNumberSort(dataState)).data as EditableSerialNumber[];
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
  }, [dataState, sharedSerialNumberPart, canSelect, selectedSerials, serialNumbers]);

  const height = useMemo(() => {
    const minRows = Math.max(serialNumbers.length, 1);
    const maxRows = Math.min(minRows, PAGE_SIZE);
    return maxRows * ROW_HEIGHT + PANELS_HEIGHT;
  }, [serialNumbers.length]);

  const rowRender: DataGridProps<EditableSerialNumber>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableSerialNumber;
    if (!item.isDisabled) {
      return row;
    }

    return React.cloneElement(row, {
      className: cx(row.props.className, classes.disabledRow),
    });
  };

  const onPageChange = useCallback((event: GridPageChangeEvent) => {
    setSkippedItemsCount(event.page.skip);
  }, []);

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
      <div className={cx(classes.gridContainer)} style={{ height }}>
        <KendoDataGrid<EditableSerialNumber>
          data={processedData}
          schema={schema}
          fullHeight
          fullWidth
          filterable
          sortable
          resizable
          hasBoxScrollbars
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          skip={skippedItemsCount}
          onPageChange={onPageChange}
          rowHeight={ROW_HEIGHT}
          pageSize={PAGE_SIZE}
          skipDataProcessing
          loading={isLoading}
          {...dataState}
          className={cx(
            classes.grid,
            { [classes.gridWithButton]: shouldShowAddButton },
          )}
          selectable={{
            enabled: canSelect,
            drag: false,
            cell: false,
            mode: 'multiple',
          }}
          onDataStateChange={updateDataState}
          onSelectionChange={toggleSelection}
          rowRender={rowRender}
        />
      </div>
      {shouldShowAddButton && (
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

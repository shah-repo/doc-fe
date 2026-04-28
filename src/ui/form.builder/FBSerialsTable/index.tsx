import { getSelectedState, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { isNull, keys } from 'lodash';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { EditableSerialNumber, SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload } from '../FBSerials/types';
import SerialsToolbar from './components/SerialsToolbar';
import { DATA_ITEM_KEY, PANELS_HEIGHT, ROW_HEIGHT, SELECTED_FIELD } from './const';
import { useSchema } from './schema';
import useStyles from './styles';

interface FBSerialsTableProps {
  serialNumbers: SerialNumber[]
  isPartSerializationManual?: boolean
  isLoading?: boolean
  toolbarRef?: React.RefObject<HTMLDivElement>
  onAdd?: () => void
  onUpdate?: (id: string, data: SerialNumberUpdateData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onBulkUpdate?: (payload: SerialNumberUpdatePayload[]) => Promise<void>
  onBulkDelete?: (ids: string[]) => Promise<void>
}

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
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef({ top: 0, left: 0 });
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});

  useLayoutEffect(() => {
    const scrollContainer = gridContainerRef.current?.querySelector<HTMLDivElement>('.k-grid-content');

    if (!scrollContainer) {
      return undefined;
    }

    const restoreScrollPosition = () => {
      const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
      const maxScrollLeft = Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth);

      scrollContainer.scrollTop = Math.min(scrollPositionRef.current.top, maxScrollTop);
      scrollContainer.scrollLeft = Math.min(scrollPositionRef.current.left, maxScrollLeft);
    };

    const preserveScrollPosition = () => {
      scrollPositionRef.current = {
        top: scrollContainer.scrollTop,
        left: scrollContainer.scrollLeft,
      };
    };

    restoreScrollPosition();
    const restoreFrame = window.requestAnimationFrame(restoreScrollPosition);

    scrollContainer.addEventListener('scroll', preserveScrollPosition, { passive: true });

    return () => {
      window.cancelAnimationFrame(restoreFrame);
      scrollContainer.removeEventListener('scroll', preserveScrollPosition);
    };
  });

  const selectedIds = useMemo(() => keys(selectedSerials).filter(sn => selectedSerials[sn]), [selectedSerials]);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = hasSelection && selectedIds.length === serialNumbers.length;

  const acceptSelected = async () => {
    const payload = selectedIds.map(id => ({ id, status: SerialNumberStatus.ACCEPTED }));
    await onBulkUpdate?.(payload);
    setSelectedSerials({});
  };

  const rejectSelected = async () => {
    await onBulkUpdate?.(selectedIds.map(id => ({ id, status: SerialNumberStatus.REJECTED })));
    setSelectedSerials({});
  };

  const deleteSelected = async () => {
    await onBulkDelete?.(selectedIds);
    setSelectedSerials({});
  };

  const toggleAllSelection = (event: CheckboxChangeEvent) => {
    if (event.target.value) {
      setSelectedSerials(serialNumbers.reduce((acc, sn) => ({ ...acc, [sn.id]: true }), {}));
    } else {
      setSelectedSerials({});
    }
  };

  const clearSelection = () => setSelectedSerials({});

  const toggleSelection = (event: GridSelectionChangeEvent) => {
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
  };

  const schema = useSchema({
    canSelect: Boolean(onBulkUpdate ?? onBulkDelete),
    isAllSelected,
    onCheckAllToggle: toggleAllSelection,
    onUpdate,
    onDelete,
  });

  const data: EditableSerialNumber[] = serialNumbers.map(sn => ({
    ...sn,
    [SELECTED_FIELD]: selectedSerials[sn.id],
  }));

  const hasData = data.length > 0;

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
        onDeleteSelected={deleteSelected}
      />

      <div className={cx(classes.gridContainer, { [classes.gridContainerEmpty]: !hasData })} style={{ height: data.length * ROW_HEIGHT + PANELS_HEIGHT }}>
        <KendoDataGrid<EditableSerialNumber>
          data={data}
          schema={schema}
          fullHeight={hasData}
          fullWidth
          filterable
          sortable
          resizable
          hasBoxScrollbars
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          loading={isLoading}
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
          containerRef={gridContainerRef}
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

import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { getSelectedState, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { isNull, keys } from 'lodash';
import React, { useMemo, useState } from 'react';
import { FBSection } from '..';
import { translate } from '../../../common/intl';
import { Button, IconButton } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import useHover from '../../hooks/useHover';
import { EditableSerialNumber, SerialNumber, SerialNumberStatus, SerialNumberUpdateData, SerialNumberUpdatePayload } from '../FBSerials/types';
import StatusButton, { StatusButtonType } from './components/StatusButton';
import { DATA_ITEM_KEY, SELECTED_FIELD } from './const';
import { useSchema } from './schema';
import useStyles from './styles';

interface FBSerialsTableProps {
  serialNumbers: SerialNumber[]
  isPartSerializationManual?: boolean
  isLoading?: boolean
  onAdd?: () => void
  onUpdate?: (id: string, data: SerialNumberUpdateData) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onBulkUpdate?: (payload: SerialNumberUpdatePayload[]) => Promise<void>
  onBulkDelete?: (ids: string[]) => Promise<void>
  onImport?: () => void
}

const FBSerialsTable: React.FC<FBSerialsTableProps> = ({
  serialNumbers,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  onBulkUpdate,
  onBulkDelete,
  onImport,
}) => {
  const classes = useStyles();
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();

  const selectedIds = useMemo(() => keys(selectedSerials), [selectedSerials]);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = hasSelection && selectedIds.length === serialNumbers.length;

  const acceptSelected = async () => {
    await onBulkUpdate?.(selectedIds.map(id => ({ id, status: SerialNumberStatus.ACCEPTED })));
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

  const clearSelection = () => {
    setSelectedSerials({});
  };

  const toggleSelection = (event: GridSelectionChangeEvent) => {
    const { dataItem } = event;
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

  const shouldShowBulkActions = hasSelection && (onBulkUpdate ?? onBulkDelete);

  return (
    <>
      <FBSection label="form.builder.serials.title">
        <div className={classes.toolbar}>
          {shouldShowBulkActions && (
            <>
              <div className={classes.selectionContainer}>
                <Tooltip title={translate('form.builder.serials.clear.selection')}>
                  <IconButton onClick={clearSelection} size="small" kind="action">
                    <FontAwesomeIcon icon={solid('xmark')} />
                  </IconButton>
                </Tooltip>
                <span>
                  <span className={classes.selectedCount}>{selectedIds.length}</span>
                    &nbsp;
                  {translate('form.builder.serials.items.selected')}
                </span>
              </div>
              {onBulkUpdate && (
                <>
                  <StatusButton
                    type={StatusButtonType.ACCEPT}
                    onClick={acceptSelected}
                  />
                  <StatusButton
                    type={StatusButtonType.REJECT}
                    onClick={rejectSelected}
                  />
                </>
              )}
              {onBulkDelete && (
                <Tooltip title={translate('form.builder.serials.delete.selected')}>
                  <IconButton
                    kind="destructive"
                    ref={deleteRef}
                    onClick={deleteSelected}
                    data-cy="action-delete"
                  >
                    <FontAwesomeIcon icon={isDeleteHovered ? solid('trash-can') : regular('trash-can')} size="lg" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          {onImport && !hasSelection && (
            <Button
              kind="ghost"
              size="small"
              startIcon={<FontAwesomeIcon icon={regular('arrow-down-to-bracket')} />}
              onClick={onImport}
            >
              {translate('form.builder.serials.import')}
            </Button>
          )}
        </div>
      </FBSection>

      <div className={cx(classes.gridContainer, { [classes.gridContainerEmpty]: !hasData })}>
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
            cell: true,
            mode: 'multiple',
          }}
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

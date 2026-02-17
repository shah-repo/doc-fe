import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { getSelectedState, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import cx from 'classnames';
import { isNull, keys } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import { FB, FBSection } from '..';
import { translate } from '../../../common/intl';
import { Button, IconButton } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { toastError } from '../../components/notifications';
import useDialog from '../../hooks/useDialog';
import useHover from '../../hooks/useHover';
import { withThemeNext } from '../../layout/theme-next';
import ImportDialog from './components/ImportDialog';
import StatusButton, { StatusButtonType } from './components/StatusButton';
import { useSchema } from './schema';
import useStyles from './styles';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData } from './types';

const DATA_ITEM_KEY = 'id';
const SELECTED_FIELD = 'selected';

const FBSerials: React.FC = () => {
  const classes = useStyles();
  const { serialsState } = FB.useStores();
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();
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

  const selectedIds = useMemo(() => keys(selectedSerials), [selectedSerials]);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = hasSelection && selectedIds.length === serialsState?.serialNumbers.length;

  const updateSerialNumber = async (id: string, payload: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumbers([{ id, ...payload }]);
  };

  const deleteSerialNumber = async (id: string) => {
    await serialsState?.deleteSerialNumber(id);
  };

  const acceptSelected = async () => {
    const promises = selectedIds.map(id =>
        serialsState?.updateSerialNumber(id, SerialNumberStatus.ACCEPTED),
    );
    await Promise.all(promises);
    setSelectedSerials({});
  };

  const rejectSelected = async () => {
    const promises = selectedIds.map(id =>
        serialsState?.updateSerialNumber(id, SerialNumberStatus.REJECTED),
    );
    await Promise.all(promises);
    setSelectedSerials({});
  };

  const deleteSelected = async () => {
    await serialsState?.deleteSerialNumbers(selectedIds);
    setSelectedSerials({});
  };

  const handleAddSerialNumber = () => {
    const serialNumber = prompt(translate('form.builder.serials.add.prompt'));
    if (serialNumber) {
      serialsState?.createSerialNumbers([serialNumber])
        .catch(toastError);
    }
  };

  const addImportedSerials = async (serials: string[]) => {
    try {
      await serialsState?.createSerialNumbers(serials);
    } catch (error) {
      toastError('Failed to add imported serial numbers');
    }
  };

  const toggleAllSelection = (event: CheckboxChangeEvent) => {
    if (!isAllSelected) {
      setSelectedSerials(serialsState?.serialNumbers.reduce((acc, sn) => ({ ...acc, [sn.id]: true }), {}) ?? {});
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
    isAllSelected: isAllSelected,
    isDeleteEnabled: isPartSerializationManual,
    onCheckAllToggle: toggleAllSelection,
    onUpdate: updateSerialNumber,
    onDelete: deleteSerialNumber,
  });

  const data: EditableSerialNumber[] = useObserver(() => (
    serialsState?.serialNumbers ?? []).map(sn => ({
    ...sn,
    [SELECTED_FIELD]: selectedSerials[sn.id],
  })));

  if (!isPartSerialized) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FBSection
        label="form.builder.serials.title"
      >
        <div className={classes.toolbar}>
          {hasSelection && (
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
              <StatusButton
                type={StatusButtonType.ACCEPT}
                onClick={acceptSelected}
              />
              <StatusButton
                type={StatusButtonType.REJECT}
                onClick={rejectSelected}
              />
              {
                isPartSerializationManual && (
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
                )
              }
            </>
          )}
          {isPartSerializationManual && !hasSelection && (
            <Button
              kind="ghost"
              size="small"
              startIcon={<FontAwesomeIcon icon={regular('arrow-down-to-bracket')} />}
              onClick={importDialog.open}
            >
              {translate('form.builder.serials.import')}
            </Button>
          )}
        </div>
      </FBSection>

      <div className={classes.gridContainer}>
        <KendoDataGrid<EditableSerialNumber>
          data={data}
          schema={schema}
          fullWidth
          fullHeight
          filterable
          sortable
          hasBoxScrollbars
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          loading={serialsState?.isLoading}
          className={cx(classes.grid, { [classes.gridWithButton]: isPartSerializationManual })}
          selectable={{
            enabled: true,
            drag: false,
            cell: true,
            mode: 'multiple',
          }}
          onSelectionChange={toggleSelection}
        />
      </div>
      {isPartSerializationManual && (
        <>
          <Button
            attached
            fullWidth
            kind="add"
            onClick={handleAddSerialNumber}
          >
            {translate('form.builder.serials.add')}
          </Button>
          <ImportDialog
            partName={partName}
            partDescription={partDescription}
            isOpen={importDialog.isOpen}
            onClose={importDialog.close}
            onConfirm={addImportedSerials}
          />
        </>
      )}
    </div>
  );
};

export default withThemeNext(FBSerials);

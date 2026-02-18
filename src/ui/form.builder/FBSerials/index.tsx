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
import AddDialog from './components/AddDialog';
import ImportDialog from './components/ImportDialog';
import StatusButton, { StatusButtonType } from './components/StatusButton';
import { DATA_ITEM_KEY, SELECTED_FIELD } from './const';
import { useSchema } from './schema';
import useStyles from './styles';
import { EditableSerialNumber, SerialNumberStatus, SerialNumberUpdateData } from './types';

const FBSerials: React.FC = () => {
  const classes = useStyles();
  const { serialsState } = FB.useStores();
  const [selectedSerials, setSelectedSerials] = useState<{ [id: string]: boolean | number[] }>({});
  const [deleteRef, isDeleteHovered] = useHover<HTMLButtonElement>();
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

  const selectedIds = useMemo(() => keys(selectedSerials), [selectedSerials]);
  const hasSelection = selectedIds.length > 0;
  const isAllSelected = hasSelection && selectedIds.length === serialsState?.serialNumbers.length;

  const updateSerialNumber = async (id: string, data: SerialNumberUpdateData) => {
    await serialsState?.updateSerialNumber(id, data);
  };

  const deleteSerialNumber = async (id: string) => {
    await serialsState?.deleteSerialNumber(id);
  };

  const acceptSelected = async () => {
    const payload = {
      status: SerialNumberStatus.ACCEPTED,
    };
    await serialsState?.updateSerialNumbers(selectedIds.map(id => ({ id, ...payload })));
    setSelectedSerials({});
  };

  const rejectSelected = async () => {
    const payload = {
      status: SerialNumberStatus.REJECTED,
    };
    await serialsState?.updateSerialNumbers(selectedIds.map(id => ({ id, ...payload })));
    setSelectedSerials({});
  };

  const deleteSelected = async () => {
    await serialsState?.deleteSerialNumbers(selectedIds);
    setSelectedSerials({});
  };

  const addSerials = async (serials: string[]) => {
    try {
      await serialsState?.createSerialNumbers(serials);
    } catch (error) {
      toastError('Failed to add serial numbers');
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

  const hasData = useMemo(() => data.length > 0, [data]);
  const isLoading = useObserver(() => serialsState?.isLoading);
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
            { [classes.gridWithButton]: isPartSerializationManual },
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
      {isPartSerializationManual && (
        <>
          <Button
            attached
            fullWidth
            kind="add"
            onClick={addDialog.open}
          >
            {translate('form.builder.serials.add')}
          </Button>
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

import cx from 'classnames';
import { kebabCase } from 'lodash';
import React from 'react';
import { Button } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import useStyles from './styles';
import { SettingsTableProps } from './types';

function SettingsTable<T extends EditableItem> ({
  data,
  schema,
  addButtonLabel,
  isEditing,
  isActive,
  onAdd,
  onRowClick,
  getRowProperties,
}: SettingsTableProps<T>): React.ReactElement {
  const classes = useStyles();

  const rowRender: DataGridProps<EditableItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableItem;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    const additionalProps = getRowProperties?.(dataItem) ?? {};

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
        key: dataItem.id,
        ...additionalProps,
      },
    );
  };

  const shouldShowAddButton = isActive && addButtonLabel && onAdd;

  return (
    <>
      <KendoDataGrid
        data={data}
        schema={schema}
        onRowClick={onRowClick}
        rowRender={rowRender}
        className={cx(classes.grid, { [classes.gridWithButton]: shouldShowAddButton })}
      />
      {shouldShowAddButton && (
        <Button
          attached
          fullWidth
          kind="add"
          data-cy={kebabCase(addButtonLabel)}
          disabled={isEditing}
          onClick={onAdd}
        >
          {addButtonLabel}
        </Button>
      )}
    </>
  );
}

export default SettingsTable;

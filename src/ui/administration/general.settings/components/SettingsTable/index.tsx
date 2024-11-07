import cx from 'classnames';
import { kebabCase } from 'lodash';
import React from 'react';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { Button } from '../../../../components/forms/fields-next';
import useStyles from './styles';
import { SettingsTableProps } from './types';

function SettingsTable<T extends EditableItem> ({
  className,
  addButtonLabel,
  isEditing,
  isActive,
  onAdd,
  getRowProperties,
  rowRender,
  ...props
}: SettingsTableProps<T>): React.ReactElement {
  const classes = useStyles();

  const defaultRowRender: DataGridProps<EditableItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableItem;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    const additionalProps = getRowProperties?.(dataItem) ?? {};
    const { className, ...propsToAdd } = additionalProps;

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, className, { [classes.updatingRow]: isUpdating }),
        ...propsToAdd,
      },
    );
  };

  const shouldShowAddButton = isActive && addButtonLabel && onAdd;
  return (
    <>
      <KendoDataGrid
        {...props}
        rowRender={rowRender ?? defaultRowRender}
        className={cx(classes.grid, className, { [classes.gridWithButton]: shouldShowAddButton })}
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

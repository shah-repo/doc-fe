import { GridSortChangeEvent } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { kebabCase } from 'lodash';
import React, { useState } from 'react';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps, EditableItem } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { Button } from '../../../../components/forms/fields-next';
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

  const [sort, setSort] = useState<Array<{ field: string, dir: 'asc' | 'desc' }>>([]);

  const rowRender: DataGridProps<EditableItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableItem;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    const additionalProps = getRowProperties?.(dataItem) ?? {};

    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
        ...additionalProps,
      },
    );
  };

  const handleSort = (event: GridSortChangeEvent) => {
    const newSort = event.sort.map(({ field, dir }) => ({
      field,
      dir: dir || 'asc',
    }));
    setSort(newSort);
  };

  const getValue = (obj: any, field: string) => {
    switch (field) {
      case 'action':
        return obj.action?.toLowerCase() || '';
      case 'from':
      case 'to':
        return obj[field]?.name?.toLowerCase() || '';
      case 'groups':
        return obj.groups?.[0]?.name?.toLowerCase() || '';
      default:
        return '';
    }
  };

  const sortedData = React.useMemo(() => {
    // Check if sort is not empty
    if (sort.length === 0) {
      // Fallback to sorting by createdAt if no sort is applied
      return data.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Destructure only if sort is not empty
    const [{ field, dir }] = sort;
    const direction = dir === 'asc' ? 1 : -1;

    return data.slice().sort((a, b) => {
      const valueA = getValue(a, field);
      const valueB = getValue(b, field);

      if (valueA > valueB) return direction;
      if (valueA < valueB) return -direction;
      return 0;
    });
  }, [data, sort]);

  const shouldShowAddButton = isActive && addButtonLabel && onAdd;
  return (
    <>
      <KendoDataGrid
        data={sortedData}
        schema={schema}
        onSortChange={handleSort}
        sort={sort}
        onRowClick={onRowClick}
        rowRender={rowRender}
        className={cx(classes.grid, { [classes.gridWithButton]: shouldShowAddButton })}
        sortable
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

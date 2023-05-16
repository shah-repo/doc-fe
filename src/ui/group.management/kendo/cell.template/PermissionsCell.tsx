import { filterBy } from '@progress/kendo-data-query';
import { MultiSelect, MultiSelectFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import { isEmpty, sortBy } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import ExpandableTemplate from '../../../components/common/kendo/ExpandableTemplate';
import { toOptions } from '../../utils/transform';

interface PermissionCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: React.CSSProperties;
  className?: string;
  columnIndex?: number;
  field?: string;
  isOfficial: boolean;
}

export const PermissionsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  isOfficial,
  field,
}: PermissionCellProps) => {
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const [data, setData] = React.useState(sortBy(toOptions(currentEmployeePermissions), 'label'));
  const [result, setResult] = React.useState([]);

  const permissions = dataItem[field || ''];

  const updatePermissionField = ({ target }) => {
    dataItem.permissions = target?.value.map((e: { value: string }) => e.value);
    setResult(target.value);
  };

  const filterChange = ({ filter }: MultiSelectFilterChangeEvent) => {
    const newData = filterBy(toOptions(currentEmployeePermissions), filter);
    setData(sortBy(newData, 'label'));
  };

  if (rowType === 'groupHeader') {
    return null;
  }
  const permissionsList = isEmpty(permissions) ? [] : permissions.split(',');
  return (
    <td
      id="kendo-expandable-column"
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit && isOfficial ? (
        <MultiSelect
          data={data}
          value={result}
          filterable={true}
          onChange={updatePermissionField}
          onFilterChange={filterChange}
          dataItemKey="value"
          textField="label"
        />
      ) : <ExpandableTemplate items={permissionsList} dataId={`${dataItem.id}-${columnIndex}`} />}
    </td>
  );
};

import { filterBy } from '@progress/kendo-data-query';
import { MultiSelect, MultiSelectFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import { sortBy } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { userManagementSelectors } from '../../../../state/ducks/userManagement';
import Tooltip from '../../../components/common/kendo/Tooltip';

interface ParentCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: React.CSSProperties;
  className?: string;
  columnIndex?: number;
  isOfficial: boolean;
  field?: string;
}

export const ParentsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  isOfficial,
  field,
}: ParentCellProps) => {
  const parents = dataItem[field || ''];
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState(sortBy(allGroups, 'label'));
  const updateParentField = ({ target }) => {
    dataItem.parents = target?.value.map((item) => ({ id: item?.value || '' }));
    setResult(target.value);
  };

  const filterChange = ({ filter }: MultiSelectFilterChangeEvent) => {
    const newData = filterBy(allGroups, filter);
    setData(sortBy(newData, 'label'));
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
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
          onChange={updateParentField}
          onFilterChange={filterChange}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <Tooltip data={parents} />
      )}
    </td>
  );
};

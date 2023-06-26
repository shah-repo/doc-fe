import { filterBy } from '@progress/kendo-data-query';
import { MultiSelect, MultiSelectFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import { isEmpty, sortBy } from 'lodash';
import React from 'react';
import { GetEmployeeResponse, LoadCompanyGroup } from '../../../../state/ducks/userManagement/types';
import ExpandableTemplate from '../../../components/common/kendo/ExpandableTemplate';
import { toMembersOptions } from '../../utils/transform';

interface LoadMemberGroupExt extends LoadCompanyGroup {
  memberNames: string
}

interface EmployeeCellProps {
  dataItem: LoadMemberGroupExt
  rowType?: string
  colSpan?: number
  style?: React.CSSProperties
  className?: string
  columnIndex?: number
  employees: GetEmployeeResponse[]
  field?: string
}

export const EmployeesCell = ({
  dataItem,
  employees,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
}: EmployeeCellProps) => {
  const employeesData = dataItem[field || ''];
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState(sortBy(toMembersOptions(employees), 'label'));
  const updateMembersField = ({ target }) => {
    dataItem.employees = target?.value.map((item: { value: string }) => ({
      id: item?.value || '',
    }));
    setResult(target.value);
  };

  const filterChange = ({ filter }: MultiSelectFilterChangeEvent) => {
    const newData = filterBy(toMembersOptions(employees), filter);
    setData(sortBy(newData, 'label'));
  };

  if (rowType === 'groupHeader') {
    return null;
  }
  const employeesList = isEmpty(employeesData) ? [] : employeesData.split(',');
  return (
    <td
      id="kendo-expandable-column"
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit
        ? <MultiSelect
          data={data}
          value={result}
          filterable={true}
          onChange={updateMembersField}
          onFilterChange={filterChange}
          dataItemKey="value"
          textField="label"
        />
        : <ExpandableTemplate items={employeesList}  dataId={`${dataItem.id}-${columnIndex}`} />
      }
    </td>
  );
};

import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { GetEmployeeResponse, LoadCompanyGroup } from '../../../../state/ducks/userManagement/types';
import ExpandableTemplate from '../../../components/common/kendo/ExpandableTemplate';
import { Autocomplete } from '../../../components/forms/fields-next';

interface LoadMemberGroupExt extends Omit<LoadCompanyGroup, 'employees'> {
  memberNames: string
  employees: Array<{ id: string }>
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
  const [result, setResult] = React.useState<GetEmployeeResponse[]>([]);
  const updateMembersField = (event: ChangeEvent<unknown>, value: GetEmployeeResponse[]) => {
    dataItem.employees = value.map(item => ({
      id: item.id,
    }));
    setResult(value);
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
      {dataItem.inEdit ? (
        <>
          <Autocomplete
            options={employees}
            value={result}
            getOptionLabel={(option: GetEmployeeResponse) => option.user.name}
            onChange={updateMembersField}
            placeholder={result.length ? undefined : translate('common.members')}
            size="small"
            multiple
          />
        </>
      ) : (
        <ExpandableTemplate
          items={employeesList}
          dataId={`${dataItem.id}-${columnIndex}`}
        />
      )
      }
    </td>
  );
};

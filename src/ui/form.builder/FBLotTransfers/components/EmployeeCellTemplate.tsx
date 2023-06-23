import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { Employee } from '../../../../state/ducks/company/types';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Autocomplete } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../constants';
import { EditableLotTransfer } from '../types';

interface Props extends CellTemplateProps<EditableLotTransfer> {
  employees: Employee[]
}

export const EmployeeCellTemplate: React.FC<Props> = ({ dataItem, employees }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const userName = useSelector(authSelectors.currentUserName);

  if (isEditMode) {
    return (
      <Autocomplete
        options={[userName]}
        value={userName}
        size="small"
        disabled
      />
    );
  }

  const employeeName = employees.find(employee => employee.id === dataItem.by)?.user?.name;
  return <>{employeeName ?? EMPTY_VALUE_PLACEHOLDER}</>;
};

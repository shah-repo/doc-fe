import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { Employee } from '../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

interface Props extends CustomTemplateProps {
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

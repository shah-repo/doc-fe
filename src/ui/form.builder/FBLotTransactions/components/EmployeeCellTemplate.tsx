import React from 'react';
import { Employee } from '../../../../state/ducks/company/types';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { LotTransfer } from '../types';

interface Props extends CellTemplateProps<LotTransfer> {
  employees: Employee[]
}
export const EmployeeCellTemplate: React.FC<Props> = ({ dataItem, employees }) => {
  const employeeName = employees.find(employee => employee.id === dataItem.by)?.user?.name || '-';
  return <>{employeeName}</>;
};

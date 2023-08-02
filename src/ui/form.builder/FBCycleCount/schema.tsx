import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../common/intl';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ActionNeededCellTemplate } from './components/ActionNeededCellTemplate';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { QuantityCellTemplate } from './components/QuantityCellTemplate';
import { ACTION_NEEDED_OPTIONS, DATE_FIELD, EMPLOYEE_FIELD } from './constants';
import { CycleCountEditEvent, EditableCycleCount } from './types';

interface SchemaOptions {
  onHandQuantityUnit?: string
  onHandQuantity?: number
  onRowClick?: (e: CycleCountEditEvent) => void
}

export const buildSchema = ({
  onHandQuantityUnit,
  onHandQuantity,
  onRowClick,
}: SchemaOptions): Array<ColumnDefinition<EditableCycleCount>> => {
  const actionNeededOptions = ACTION_NEEDED_OPTIONS.map((option) => createOption(option.value, option.label));

  const ActionNeededFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={actionNeededOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const countSystemTitle
    = onHandQuantityUnit
      ? `${translate('form.builder.cycle.count.count.system')}\n (${onHandQuantityUnit})`
      : translate('form.builder.cycle.count.count.system');

  return [
    {
      id: 'by',
      field: EMPLOYEE_FIELD,
      title: 'form.builder.cycle.count.by',
      filterCell: InputFilter,
      template: (props) => <EmployeeCellTemplate {...props} onClick={onRowClick} />,
      width: 200,
    },
    {
      id: 'count',
      field: 'count',
      filterCell: InputFilter,
      title: 'form.builder.cycle.count.count',
      template: (props) => <QuantityCellTemplate {...props} />,
      width: 150,
    },
    {
      id: 'system-count',
      field: 'systemCount',
      filterCell: InputFilter,
      title: countSystemTitle,
      template: (props) => <QuantityCellTemplate {...props} defaultValue={onHandQuantity} disabled />,
      width: 150,
    },
    {
      id: 'date',
      field: DATE_FIELD,
      title: 'form.builder.cycle.count.date',
      filterCell: InputFilter,
      template: (props) => <DateCellTemplate {...props} onClick={onRowClick} />,
      width: 170,
    },
    {
      id: 'action-needed',
      field: 'actionNeeded',
      title: 'form.builder.cycle.count.action.needed',
      filterCell: ActionNeededFilter,
      template: (props) => <ActionNeededCellTemplate {...props} onClick={onRowClick} />,
      width: 140,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.cycle.count.comments',
      filterCell: InputFilter,
      template: (props) => <CommentsCellTemplate {...props} onClick={onRowClick} />,
      width: 250,
    },
  ];
};

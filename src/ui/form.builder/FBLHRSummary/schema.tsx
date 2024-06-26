import React from 'react';
import { ActionsCellTemplate } from '../../change.request/FBMaterialDisposition/components/commonCells/ActionsCellTemplate';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActualIDCell } from './components/cells/ActualIDCell';
import { ByCell } from './components/cells/ByCell';
import { DateCell } from './components/cells/DateCell';
import { IssuesCell } from './components/cells/IssuesCell';
import { LotIDCell } from './components/cells/LotIDCell';
import { PlannedIDCell } from './components/cells/PlannedIDCell';
import { QuantityCell } from './components/cells/QuantityCell';
import { StatusCell } from './components/cells/StatusCell';
import { StepCell } from './components/cells/StepCell';
import { TextInputCellTemplate } from './components/cells/TextInputCellTemplate';
import { TypeCell } from './components/cells/TypeCell';
import { EditableLHRSummaryItem, SchemaOptions } from './types';

export const buildSchema = ({
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
}: SchemaOptions): Array<ColumnDefinition<EditableLHRSummaryItem>> => {
  return [
    {
      id: 'type',
      field: 'type',
      title: 'lhr.summary.grid.heading.type',
      template: (props) => <TypeCell {...props} onClick={onRowClick} />,
      show: true,
      width: 201,
    },
    {
      id: 'mpiId',
      field: 'mpiId',
      title: 'lhr.summary.grid.heading.step',
      show: true,
      template: (props) => <StepCell {...props} onClick={onRowClick} />,
      width: 401,
      sortable: false,
    },
    {
      id: 'plannedId',
      field: 'plannedId',
      title: 'lhr.summary.grid.heading.planned.id',
      template: (props) => <PlannedIDCell {...props} onClick={onRowClick} />,
      show: true,
      width: 201,
    },
    {
      id: 'actualId',
      field: 'actualId',
      title: 'lhr.summary.grid.heading.actual.id',
      template: (props) => <ActualIDCell {...props} onClick={onRowClick} />,
      show: true,
      sortable: false,
      selectable: false,
      width: 201,
    },
    {
      id: 'lotOrEquipment',
      field: 'lotOrEquipment',
      title: 'lhr.summary.grid.heading.lot',
      show: true,
      selectable: false,
      template: (props) => <LotIDCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'expiryDate',
      field: 'expiryDate',
      title: 'lhr.summary.grid.heading.expiry.date',
      show: true,
      selectable: false,
      template: (props) => <DateCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'issue',
      field: 'issue',
      title: 'lhr.summary.grid.heading.issue',
      template: (props) => <IssuesCell {...props} onClick={onRowClick} />,
      show: true,
      sortable: false,
      selectable: false,
      width: 201,
    },
    {
      id: 'startQuantity',
      field: 'startQuantity',
      title: 'lhr.summary.grid.heading.start.qty',
      show: true,
      selectable: false,
      template: (props) => <QuantityCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'endQuantity',
      field: 'endQuantity',
      title: 'lhr.summary.grid.heading.end.qty',
      show: true,
      selectable: false,
      template: (props) => <QuantityCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'lotStatus',
      field: 'lotStatus',
      title: 'lhr.summary.grid.heading.lotStatus',
      show: true,
      template: (props) => <StatusCell {...props} onClick={onRowClick} />,
      selectable: false,
      width: 201,
    },
    {
      field: 'calDueDate',
      id: 'calDueDate',
      selectable: false,
      title: 'lhr.summary.grid.heading.cal.due.date',
      show: true,
      template: (props) => <DateCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'pmDueDate',
      field: 'pmDueDate',
      title: 'lhr.summary.grid.heading.pm.due.date',
      show: true,
      template: (props) => <DateCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'lhr.summary.grid.heading.comments',
      show: true,
      template: (props) => <TextInputCellTemplate {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'enteredBy',
      field: 'enteredBy',
      title: 'lhr.summary.grid.heading.entered.by',
      show: true,
      template: (props) => <ByCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'date',
      field: 'date',
      title: 'lhr.summary.grid.heading.date',
      show: true,
      template: (props) => <DateCell {...props} onClick={onRowClick} />,
      width: 201,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      show: true,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};

import React from 'react';
import { Employee } from '../../../state/ducks/company/types';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { BuildCellTemplate } from './components/BuildCellTemplate';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { EmployeeCellTemplate } from './components/EmployeeCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import { QuantityCellTemplate } from './components/QuantityCellTemplate';
import { TransferTypeCellTemplate } from './components/TransferTypeCellTemplate';
import { BuildOption, CompanyLocation, EditableLotTransfer } from './types';

interface SchemaOptions {
  locations: CompanyLocation[]
  employees: Employee[]
  builds: BuildOption[]
  isActive: boolean
  actionsClass: string
  onDiscard: () => void
  onConfirm: () => unknown
}

export const buildSchema = ({
  locations,
  employees,
  builds,
  isActive,
  actionsClass,
  onDiscard,
  onConfirm,
}: SchemaOptions): Array<ColumnDefinition<EditableLotTransfer>> => ([
  {
    id: 'type',
    field: 'type',
    title: 'form.builder.lot.transfers.type',
    template: TransferTypeCellTemplate,
    width: 180,
  },
  {
    id: 'from',
    field: 'from',
    title: 'form.builder.lot.transfers.from',
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
    width: 180,
  },
  {
    id: 'to',
    field: 'to',
    title: 'form.builder.lot.transfers.to',
    template: (props) => <LocationCellTemplate {...props} locations={locations} />,
    width: 180,
  },
  {
    id: 'build',
    field: 'build',
    title: 'form.builder.lot.transfers.build',
    template: (props) => <BuildCellTemplate {...props} builds={builds} />,
    width: 200,
  },
  {
    id: 'quantity',
    field: 'quantity',
    title: 'form.builder.lot.transfers.quantity',
    template: QuantityCellTemplate,
    width: 100,
  },
  {
    id: 'date',
    field: 'date',
    title: 'form.builder.lot.transfers.date',
    template: DateCellTemplate,
    width: 160,
  },
  {
    id: 'by',
    field: 'by',
    title: 'form.builder.lot.transfers.by',
    template: (props) => <EmployeeCellTemplate {...props} employees={employees} />,
    width: 200,
  },
  {
    id: 'comments',
    field: 'comments',
    title: 'form.builder.lot.transfers.comments',
    template: CommentsCellTemplate,
    width: 250,
  },
  {
    id: 'actions',
    field: 'actions',
    filterable: false,
    className: actionsClass,
    template: (props) => <ActionsCellTemplate {...props} onDiscard={onDiscard} onConfirm={onConfirm} />,
    hidden: !isActive,
    locked: true,
    width: 1,
  },
]);

import React from 'react';
import { translate } from '../../../../../common/intl';
import { ActionsCell } from './components/Actions';
import { CostCell } from './components/CostCell';
import { LeadTimeCell } from './components/LeadTimeCell';
import PartIDCell from './components/PartIDCell';
import { RevCell } from './components/RevCell';
import { StatusCell } from './components/StatusCell';
import { TitleCell } from './components/TitleCell';
import { SchemaOptions } from './types';

export const buildSchema = ({ onConfirm, onDiscard, onDelete, onRefresh, actionsClass, isDisabled }: SchemaOptions) => ([
  {
    id: 'id',
    field: 'docId',
    title: translate('bom.drawerTable.field.docId.title'),
    width: 150,
    template: (props) => (
      <PartIDCell {...props} onRefresh={onRefresh} />
    ),
  },
  {
    id: 'revision',
    field: 'displayRevision',
    title: translate('bom.drawerTable.field.revision.title'),
    width: 70,
    template: RevCell,
  },
  {
    id: 'name',
    field: 'name',
    title: translate('bom.drawerTable.field.name.title'),
    width: 160,
    template: TitleCell,
  },
  {
    id: 'cost',
    field: 'cost',
    title: translate('bom.drawerTable.field.cost.title'),
    width: 90,
    template: CostCell,
  },
  {
    id: 'leadTime',
    field: 'leadTime',
    title: translate('bom.drawerTable.field.leadTime.title'),
    width: 110,
    template: LeadTimeCell,
  },
  {
    id: 'status',
    field: 'displayStatus',
    title: translate('bom.drawerTable.field.status.title'),
    template: StatusCell,
    width: 170,
  },
  {
    id: 'actions',
    title: 'actions',
    className: actionsClass,
    template: (props) => (
      <ActionsCell
        {...props}
        onConfirm={onConfirm}
        onDiscard={onDiscard}
        onDelete={onDelete}
        isDisabled={isDisabled}
      />
    ),
    width: 1,
  },
]);

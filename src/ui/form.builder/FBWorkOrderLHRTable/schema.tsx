import React from 'react';
import { translate } from '../../../common/intl';
import { DateCell } from './components/DateCell';
import { LhrDetailsCell } from './components/LhrDetailsCell';
import { LhrTemplateCell } from './components/LhrTemplateCell';
import LotIDCell from './components/LotIDCell';
import { OwnerCell } from './components/OwnerCell';
import { PartRevCell } from './components/PartRevCell';
import { QuantityCell } from './components/QuantityCell';
import { StatusCell } from './components/StatusCell';
import { LHRTableItemEditEvent, SchemaItem } from './types';

export const buildSchema = ({
  onRowClick,
}: {onRowClick?: (e: LHRTableItemEditEvent) => void}): SchemaItem[] => ([
  {
    id: 'id',
    field: 'lotId',
    title: translate('form.builder.workOrder.lhr.lotId'),
    width: 180,
    template: (props) => <LotIDCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'status',
    field: 'displayStatus',
    title: translate('form.builder.workOrder.lhr.status'),
    width: 150,
    template: (props) => <StatusCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'owner',
    field: 'owner',
    title: translate('form.builder.workOrder.lhr.owner'),
    width: 240,
    template: (props) => <OwnerCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'partRev',
    field: 'partRev',
    title: translate('form.builder.workOrder.lhr.partRev'),
    width: 300,
    template: (props) => <PartRevCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'completionDate',
    field: 'completionDate',
    title: translate('form.builder.workOrder.lhr.completionDate'),
    width: 150,
    template: (props) => <DateCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'startQuantity',
    field: 'startQuantity',
    title: translate('form.builder.workOrder.lhr.startQuantity'),
    width: 110,
    template: (props) => <QuantityCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'endQuantity',
    field: 'endQuantity',
    title: translate('form.builder.workOrder.lhr.endQuantity'),
    width: 110,
    template: (props) => <QuantityCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'lhrTemplate',
    field: 'lhrTemplate',
    title: translate('form.builder.workOrder.lhr.lhrTemplate'),
    width: 180,
    template: (props) => <LhrTemplateCell {...props} onClick={onRowClick} />,
  },
  {
    id: 'lhrDetails',
    field: 'lhrDetails',
    disableShowOrHideSelection: true,
    title: translate('form.builder.workOrder.lhr.lhrDetails'),
    width: 240,
    template: (props) => <LhrDetailsCell {...props} onClick={onRowClick} />,
    locked: true,
  },
]);

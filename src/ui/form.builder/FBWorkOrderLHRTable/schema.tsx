import { translate } from '../../../common/intl';
import { DateCell } from './components/DateCell';
import { LhrDetailsCell } from './components/LhrDetailsCell';
import { LhrTemplateCell } from './components/LhrTemplateCell';
import LotIDCell from './components/LotIDCell';
import { OwnerCell } from './components/OwnerCell';
import { PartRevCell } from './components/PartRevCell';
import { QuantityCell } from './components/QuantityCell';
import { StatusCell } from './components/StatusCell';
import { SchemaItem } from './types';

export const buildSchema = (): SchemaItem[] => ([
  {
    id: 'id',
    field: 'lotId',
    title: translate('form.builder.workOrder.lhr.lotId'),
    width: 180,
    template: LotIDCell,
  },
  {
    id: 'status',
    field: 'displayStatus',
    title: translate('form.builder.workOrder.lhr.status'),
    width: 150,
    template: StatusCell,
  },
  {
    id: 'owner',
    field: 'owner',
    title: translate('form.builder.workOrder.lhr.owner'),
    width: 240,
    template: OwnerCell,
  },
  {
    id: 'partRev',
    field: 'partRev',
    title: translate('form.builder.workOrder.lhr.partRev'),
    width: 300,
    template: PartRevCell,
  },
  {
    id: 'completionDate',
    field: 'completionDate',
    title: translate('form.builder.workOrder.lhr.completionDate'),
    width: 150,
    template: DateCell,
  },
  {
    id: 'startQuantity',
    field: 'startQuantity',
    title: translate('form.builder.workOrder.lhr.startQuantity'),
    width: 110,
    template: QuantityCell,
  },
  {
    id: 'endQuantity',
    field: 'endQuantity',
    title: translate('form.builder.workOrder.lhr.endQuantity'),
    width: 110,
    template: QuantityCell,
  },
  {
    id: 'lhrTemplate',
    field: 'lhrTemplate',
    title: translate('form.builder.workOrder.lhr.lhrTemplate'),
    width: 180,
    template: LhrTemplateCell,
  },
  {
    id: 'lhrDetails',
    field: 'lhrDetails',
    title: translate('form.builder.workOrder.lhr.lhrDetails'),
    width: 240,
    template: LhrDetailsCell,
    locked: true,
  },
]);

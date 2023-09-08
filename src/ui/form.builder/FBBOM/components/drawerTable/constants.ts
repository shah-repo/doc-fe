import { translate } from '../../../../../common/intl';
import { CostCell } from './components/CostCell';
import { LeadTimeCell } from './components/LeadTimeCell';
import PartIDCell from './components/PartIDCell';
import { RevCell } from './components/RevCell';
import { StatusCell } from './components/StatusCell';
import { TitleCell } from './components/TitleCell';

export const schema = [{
  id: 'id',
  field: 'docId',
  title: translate('bom.drawerTable.field.docId.title'),
  width: 150,
  template: PartIDCell,
},
{
  id: 'revision',
  field: 'revision',
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
  field: 'status',
  title: translate('bom.drawerTable.field.status.title'),
  template: StatusCell,
  width: 170,
},
];

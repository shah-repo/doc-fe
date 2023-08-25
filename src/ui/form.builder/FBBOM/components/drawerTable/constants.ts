import { CostCell } from './components/CostCell';
import { LeadTimeCell } from './components/LeadTimeCell';
import PartIDCell from './components/PartIDCell';
import { RevCell } from './components/RevCell';
import { StatusCell } from './components/StatusCell';
import { TitleCell } from './components/TitleCell';

export const schema = [{
  id: 'id',
  field: 'docId',
  title: 'PART ID',
  width: '150px',
  template: PartIDCell,
},
{
  id: 'revision',
  field: 'revision',
  title: 'REV',
  width: '70px',
  template: RevCell,
},
{
  id: 'name',
  field: 'name',
  title: 'TITLE',
  width: '160px',
  template: TitleCell,
},
{
  id: 'cost',
  field: 'cost',
  title: 'COST',
  width: '90px',
  template: CostCell,
},
{
  id: 'leadTime',
  field: 'leadTime',
  title: 'LEAD TIME',
  width: '110px',
  template: LeadTimeCell,
},
{
  id: 'status',
  field: 'status',
  title: 'STATUS',
  template: StatusCell,
  width: '170px',
},
];

import { chain } from 'lodash';
import { pagerSettings } from '../../components/common/kendo/helpers';
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from '../../components/common/kendo/types';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';

const columns: KendoColumn[] = [
  {
    field: 'crId',
    title: 'common.crid',
    show: true,
    filter: 'text',
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
    extraFields: ['id'],
  },
  {
    field: 'title',
    title: 'cr.title',
    show: true,
    filter: 'text',
    locked: false,
    width: 40,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
    showTooltip: true,
    tooltipField: 'description',
  },
  {
    field: 'owner.user.name',
    title: 'change.request.list.owner',
    show: true,
    filter: 'text',
    locked: false,
    width: 30,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 3,
    extraFields: ['owner.user.avatar', 'owner.user.initialColor'],
  },
  {
    field: 'state',
    title: 'common.status',
    show: true,
    locked: false,
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    filterCell: KendoGridFilterCell.STATE,
    showColumnMenu: true,
    orderIndex: 4,
  },
];

const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  groupableFields: chain(columns).filter({ groupable: true }).map('field').value(),
};

export default gridConfiguration;

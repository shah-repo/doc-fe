import { chain } from 'lodash';
import { pagerSettings } from '../../components/common/kendo/helpers';
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from '../../components/common/kendo/types';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';

const columns: KendoColumn[] = [
  {
    field: 'taskType',
    title: 'async.task.type',
    show: true,
    groupable: true,
    locked: false,
    orderIndex: 1,
    showColumnMenu: true,
    width: 30,
    filterCell: KendoGridFilterCell.TASKTYPE,
  },
  {
    field: 'createdAt',
    title: 'async.tasks.timestamp',
    show: true,
    groupable: false,
    locked: false,
    orderIndex: 2,
    showColumnMenu: true,
    width: 25,
    cell: KendoCellTemplates.DURATION,
    filterCell: KendoGridFilterCell.ASYNC_CREATED_AT,
  },
  {
    field: 'duration',
    title: 'async.task.duration',
    show: true,
    filter: 'numeric',
    groupable: false,
    locked: false,
    orderIndex: 3,
    showColumnMenu: true,
    width: 20,
    cell: KendoCellTemplates.DURATION,
  },
  {
    field: 'nextTaskTypes',
    title: 'async.task.next.task.types',
    show: true,
    filterable: false,
    groupable: false,
    locked: false,
    orderIndex: 4,
    showColumnMenu: true,
    width: 15,
  },
  {
    field: 'status',
    title: 'async.task.status',
    show: true,
    groupable: true,
    locked: false,
    orderIndex: 5,
    showColumnMenu: true,
    width: 20,
    filterCell: KendoGridFilterCell.STATUS,
  },
  {
    field: 'employee.user.name',
    title: 'common.name',
    show: true,
    filter: 'text',
    locked: false,
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 6,
    extraFields: ['owner.user.avatar', 'owner.user.initialColor'],
  },
  {
    field: 'employee.user.email',
    title: 'common.email',
    show: true,
    filter: 'text',
    groupable: true,
    locked: false,
    orderIndex: 7,
    showColumnMenu: true,
    width: 20,
  },
];

const gridConfiguration: KendoGridConfiguration = {
  groupableFields: chain(columns)
    .filter({ groupable: true })
    .map('field')
    .value(),
  columns,
  pagerSettings,
};

export default gridConfiguration;

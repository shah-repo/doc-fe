import { pagerSettings } from '../../components/common/kendo/helpers';
import { KendoColumn, KendoGridConfiguration, PageState } from '../../components/common/kendo/types';

const columns: KendoColumn[] = [
  {
    field: 'status',
    title: 'user.management.signed.up',
    show: true,
    filter: 'boolean',
    locked: false,
    orderIndex: 1,
    groupable: true,
    showColumnMenu: true,
  },
  {
    field: 'user.name',
    title: 'common.name',
    show: true,
    filter: 'text',
    groupable: false,
    locked: false,
    orderIndex: 2,
    showColumnMenu: false,
  },
  {
    field: 'user.email',
    title: 'common.email',
    show: true,
    filter: 'text',
    groupable: false,
    locked: false,
    orderIndex: 3,
    showColumnMenu: false,
  },
  {
    field: 'groups',
    title: 'common.groups',
    show: true,
    filter: 'text',
    groupable: false,
    locked: false,
    orderIndex: 4,
    showColumnMenu: false,
    width: 500,
  },
  {
    field: 'activeStatus',
    title: 'common.active',
    show: true,
    filter: 'text',
    groupable: true,
    locked: false,
    orderIndex: 5,
    showColumnMenu: true,
  },
  {
    field: '',
    title: '',
    show: true,
    groupable: false,
    filterable: false,
    locked: true,
    width: '60px',
    reorderable: false,
    resizable: false,
    orderIndex: 6,
    showColumnMenu: false,
  },
];

const initialDataState: PageState = { skip: 0, take: 25 };
const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  initialDataState,
};
export const enterUserInfo = { name: '', email: '' };
export default gridConfiguration;

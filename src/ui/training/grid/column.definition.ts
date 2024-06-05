import { chain } from 'lodash';
import { pagerSettings } from '../../components/common/kendo/helpers';
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from '../../components/common/kendo/types';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';
import { DateFields } from './interfaces';

export const ACTIVE_KEY = 'trainingPlan.employee.active';
export const REF_ID_FIELD = 'trainingPlan.sourceReferencesIds';
export const REF_ID_FILTER_FIELD = 'sourceReference';

const columns: KendoColumn[] = [
  {
    field: 'trId',
    title: 'common.trId',
    show: true,
    filter: 'text',
    locked: false,
    width: 10,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 1,
    extraFields: ['id'],
  },
  {
    field: 'trainingPlan.document.docId',
    title: 'common.docId',
    show: true,
    filter: 'text',
    locked: false,
    width: 10,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 2,
  },
  {
    field: 'documentRevision.displayRevision',
    title: 'common.revision',
    show: true,
    filter: 'text',
    locked: false,
    width: 9,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 3,
    extraFields: ['documentRevision.documentId', 'documentRevision.id'], // to render data in Record popup
  },
  {
    field: 'documentRevision.name',
    title: 'document.title',
    show: true,
    filter: 'text',
    locked: false,
    width: 20,
    showColumnMenu: true,
    groupable: false,
    orderIndex: 4,
  },
  {
    field: 'trainingPlan.employee.user.name',
    title: 'common.trainee',
    show: true,
    filter: 'text',
    locked: false,
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 5,
    extraFields: ['trainingPlan.employee.user.avatar', 'trainingPlan.employee.user.initialColor'],
  },
  {
    field: DateFields.ASSIGNED_AT,
    title: 'common.assign.date',
    show: true,
    locked: false,
    width: 12,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 6,
    cell: KendoCellTemplates.DATE_INFO,
    filterCell: KendoGridFilterCell.CREATED_AT,
  },
  {
    field: DateFields.DUE_ON,
    title: 'common.due.date',
    show: true,
    filter: 'text',
    locked: false,
    width: 12,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 7,
    cell: KendoCellTemplates.DATE_INFO,
    filterCell: KendoGridFilterCell.DUE_ON,
  },
  {
    field: DateFields.COMPLETED_AT,
    title: 'common.completed.on',
    show: true,
    filter: 'text',
    locked: false,
    width: 12,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 8,
    cell: KendoCellTemplates.DATE_COMPLETED,
    filterCell: KendoGridFilterCell.COMPLETED_AT,
  },
  {
    field: REF_ID_FIELD,
    title: 'common.ref.id',
    show: true,
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 9,
    cell: KendoCellTemplates.DOC_ID_LIST_CELL,
    filter: 'text',
    extraFields: ['trainingPlan.sourceReferences'], // to render data in Record popup
  },
  {
    field: ACTIVE_KEY,
    title: 'common.active',
    show: true,
    locked: false,
    width: 10,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 10,
    filter: 'boolean',
    cell: KendoCellTemplates.ACTIVE,
    filterCell: KendoGridFilterCell.ACTIVE,
  },
];

const gridConfiguration: KendoGridConfiguration = {
  columns,
  pagerSettings,
  groupableFields: chain(columns)
    .filter({ groupable: true })
    .map('field')
    .value(),
};

export default gridConfiguration;

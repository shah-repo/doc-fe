import { chain } from 'lodash';
import { pagerSettings } from '../../components/common/kendo/helpers';
import { KendoCellTemplates, KendoColumn, KendoGridConfiguration } from '../../components/common/kendo/types';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';

const columns: KendoColumn[] = [
  {
    field: 'document.docId',
    title: 'document.revision.list.docId',
    show: true,
    filter: 'text',
    locked: false,
    width: 8,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
    extraFields: ['id', 'document.id'],
  },
  {
    field: 'displayRevision',
    title: 'document.revision.list.revision',
    show: true,
    filter: 'text',
    locked: false,
    width: 8,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: 'name',
    title: 'document.revision.list.name',
    show: true,
    filter: 'text',
    locked: false,
    width: 30,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 3,
    showTooltip: true,
    tooltipField: 'description',
  },
  {
    field: 'document.documentType.documentTypeAcronym',
    title: 'document.revision.list.type',
    show: true,
    filter: 'text',
    locked: false,
    width: 12,
    groupable: true,
    cell: KendoCellTemplates.DOCUMENT_TYPE,
    filterCell: KendoGridFilterCell.DOCUMENT_TYPE_ACRONYM,
    showColumnMenu: true,
    orderIndex: 4,
    showTooltip: true,
    tooltipField: 'document.documentType.documentTypeName',
  },
  {
    field: 'owner.user.name',
    title: 'common.owner',
    show: true,
    filter: 'text',
    locked: false,
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 5,
    extraFields: ['owner.user.avatar', 'owner.user.initialColor'],
  },
  {
    field: 'changeRequest.crId',
    title: 'common.crid',
    show: true,
    filter: 'text',
    locked: false,
    width: 8,
    groupable: false,
    showColumnMenu: true,
    orderIndex: 6,
  },
  {
    field: 'displayStatus',
    title: 'document.revision.list.state',
    show: true,
    locked: false,
    width: 14,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    filterCell: KendoGridFilterCell.DISPLAY_STATUS,
    showColumnMenu: true,
    orderIndex: 7,
  },
  {
    field: 'effectiveDate',
    title: 'common.effective.date',
    show: true,
    locked: false,
    width: 12,
    groupable: false,
    cell: KendoCellTemplates.DATE_INFO,
    filterCell: KendoGridFilterCell.EFFECTIVE_DATE,
    showColumnMenu: true,
    orderIndex: 8,
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

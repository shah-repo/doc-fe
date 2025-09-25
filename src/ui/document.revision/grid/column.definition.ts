import { ColumnInfo } from '../../common/utils/helpers';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';
import { KendoCellTemplates } from '../../components/common/kendo/types';

export const predefinedColumnDetails: {[key: string]: ColumnInfo} = {
  'document.docId': {
    width: 8,
    groupable: false,
    showTooltip: true,
    filter: 'text',
    locked: false,
  },
  displayRevision: {
    width: 8,
    groupable: false,
    filter: 'text',
    locked: false,
  },
  name: {
    width: 30,
    groupable: false,
    showTooltip: true,
    tooltipField: 'description',
    filter: 'text',
    locked: false,
  },
  'document.documentType.documentTypeAcronym': {
    width: 12,
    groupable: true,
    showTooltip: true,
    tooltipField: 'document.documentType.documentTypeName',
    cell: KendoCellTemplates.DOCUMENT_TYPE,
    filterCell: KendoGridFilterCell.DOCUMENT_TYPE_ACRONYM,
    locked: false,
  },
  'owner.user.name': {
    width: 20,
    groupable: true,
    filter: 'text',
    cell: KendoCellTemplates.USER_AVATAR,
    locked: false,
  },
  'changeRequest.crId': {
    width: 8,
    groupable: false,
    filter: 'text',
    locked: false,
  },
  displayStatus: {
    width: 14,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    filterCell: KendoGridFilterCell.DISPLAY_STATUS,
    locked: false,
  },
  effectiveDate: {
    width: 12,
    groupable: false,
    cell: KendoCellTemplates.DATE_INFO,
    filterCell: KendoGridFilterCell.EFFECTIVE_DATE,
    locked: false,
  },
};

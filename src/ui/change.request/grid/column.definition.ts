import { ColumnInfo } from '../../common/utils/helpers';
import { KendoGridFilterCell } from '../../components/KendoGrid/interfaces';
import { KendoCellTemplates } from '../../components/common/kendo/types';

export const predefinedColumnDetails: {[key: string]: ColumnInfo} = {
  crId: {
    width: 10,
    groupable: false,
    showTooltip: true,
    filter: 'text',
    locked: false,
  },
  title: {
    width: 40,
    groupable: false,
    filter: 'text',
    showTooltip: true,
    tooltipField: 'description',
    locked: false,
  },
  'owner.user.name': {
    width: 30,
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    filter: 'text',
    locked: false,
  },
  state: {
    width: 20,
    groupable: true,
    cell: KendoCellTemplates.STATUS,
    filterCell: KendoGridFilterCell.STATE,
    locked: false,
  },
};

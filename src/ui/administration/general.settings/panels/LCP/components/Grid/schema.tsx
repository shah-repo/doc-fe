import { translate } from '../../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { LCP } from './types';

export const LCPSchema = (): Array<ColumnDefinition<LCP>> => {
  return [
    {
      id: 'enlilType',
      field: 'enlilType',
      title: translate('administration.general.settings.lcp.enlilType'),
      width: 200,
      locked: false,
      groupable: false,
      sortable: false,
    },
    {
      id: 'displayLabel',
      field: 'displayLabel',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.displayLabel'),
      width: 228,
    },
    {
      id: 'isAllowedOnPO',
      field: 'isAllowedOnPO',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedOnPO'),
      width: 260,
      mainOrderIndex: 3,
    },
    {
      id: 'isAllowedOnLhrProd',
      field: 'isAllowedOnLhrProd',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedOnLhrProd'),
      width: 180,
      mainOrderIndex: 4,
    },
    {
      id: 'isAllowedToBuy',
      field: 'isAllowedToBuy',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.isAllowedToBuy'),
      width: 180,
      mainOrderIndex: 5,
    },
    {
      id: 'category',
      field: 'category',
      hidden: true,
      locked: false,
      groupable: false,
      mainOrderIndex: 5,
    },
  ];
};

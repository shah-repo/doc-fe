import { translate } from '../../../../../../../common/intl';
import { ColumnDefinition } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { LCP } from './types';

export const LCPSchema = (): Array<ColumnDefinition<LCP>> => {
  return [
    {
      id: 'type',
      field: 'type',
      title: translate('administration.general.settings.lcp.col1'),
      width: 200,
      locked: false,
      groupable: false,
      sortable: false,
    },
    {
      id: 'label',
      field: 'label',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.col2'),
      width: 228,
    },
    {
      id: 'AllowOnPOWithApprovedSupplier',
      field: 'AllowOnPOWithApprovedSupplier',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.col3'),
      width: 228,
      mainOrderIndex: 3,
    },
    {
      id: 'AllowOnLHRProduction',
      field: 'AllowOnLHRProduction',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.col4'),
      width: 180,
      mainOrderIndex: 4,
    },
    {
      id: 'AllowToBuy',
      field: 'AllowToBuy',
      locked: false,
      groupable: false,
      title: translate('administration.general.settings.lcp.col5'),
      width: 228,
      mainOrderIndex: 5,
    },
  ];
};

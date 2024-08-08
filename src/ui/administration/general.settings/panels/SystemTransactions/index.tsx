import { useFormikContext } from 'formik';
import { noop } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SettingsPanelProps } from '../../types';
import { LocationCellTemplate } from '../MaterialFlow/components/LocationCellTemplate';

// const PANEL_FIELD = 'materialFlowAcl';

const RULES = [
  {
    active: true,
    id: 'createFromRecieving',
    from: '8048257c-5f2c-4bf4-ab63-5bce2b33e351',
    to: '9d82b1f1-db0b-4e9b-93df-bc739272fc62',
  },
  {
    active: false,
    id: 'scrapFromMd',
    from: '285b195c-6640-4e65-90a1-e2fee181a760',
    to: null,
  },
];

const SystemTransactionsSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values } = useFormikContext<GeneralSettings>();
  const locations = useSelector(companySelectors.getAllLocations) ?? [];
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));

  const schema = [
    {
      id: 'active',
      field: 'active',
      title: 'common.active',
      width: 70,
      template: (props) => (
        <ActiveCellTemplate
          {...props}
          onActiveStateChange={noop}
        />
      ),
    },
    {
      id: 'when',
      field: 'when',
      title: 'administration.general.settings.system.transactions.when',
      template: TextCellTemplate,
    },
    {
      id: 'from',
      field: 'from',
      title: 'administration.general.settings.material.flow.location.from',
      template: (props) => (
        <LocationCellTemplate
          {...props}
          options={locations}
        />
      ),
    },
    {
      id: 'to',
      field: 'to',
      title: 'administration.general.settings.material.flow.location.to',
      template: (props) => (
        <LocationCellTemplate
          {...props}
          options={locations}
        />
      ),
    },
  ];

  const data = RULES.map(rule => ({
    active: rule.active,
    when: rule.id,
    from: rule.from,
    to: rule.to,
    [MODE_FIELD]: Mode.show,
  }));

  console.log({
    locations,
    values,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.system.transactions')}
    >
      <SettingsTable
        isActive={isActive}
        data={data}
        schema={schema}
      />
    </SettingsPanel>
  );
};

export default SystemTransactionsSettingsPanel;

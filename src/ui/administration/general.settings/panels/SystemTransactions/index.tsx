import { useFormikContext } from 'formik';
import { noop } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import ActiveCellTemplate from '../../components/SettingsTable/components/ActiveCellTemplate';
import TextCellTemplate from '../../components/SettingsTable/components/TextCellTemplate';
import { SettingsPanelProps } from '../../types';
import { LocationCellTemplate } from '../MaterialFlow/components/LocationCellTemplate';

// const PANEL_FIELD = 'materialFlowAcl';

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

  const data = [

  ];

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

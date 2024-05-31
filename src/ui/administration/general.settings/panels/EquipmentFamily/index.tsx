import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { EquipmentLocation, GeneralSettings } from '../../../../../state/ducks/company/types';
import Text from '../../../../components/Text';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsPanelSection from '../../components/SettingsPanelSection';
import SwitchControl from '../../components/SwitchControl';
import { EquipmentFamily } from '../../constants';
import { SettingsPanelProps } from '../../types';
import DataTable from './DataTable';

const status = [
  {
      id: 'f4216410-1747-42a5-85be-63586a16db55',
      name: 'Status one',
      active: true,
  },
  {
      id: '82a79e10-349b-4f6e-b9f0-aeaf8d8a2d66',
      name: 'Status two',
      active: false,
  },
];

const EquipmentFamilySettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { getFieldProps } = useFormikContext<GeneralSettings>();
  const locations = getFieldProps('equipmentFamily.locations').value as EquipmentLocation[];
  const fieldProps = getFieldProps('equipmentFamily.autoSyncEnabled');

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.equipmentFamily.tab')}>
      <SettingsPanelSection>
        <Text message="administration.general.settings.equipmentFamily.es" />
      </SettingsPanelSection>
      <SwitchControl
        {...fieldProps}
        checked={fieldProps.value}
        label={translate('administration.general.settings.equipmentFamily.es.autoSync')}
      />
      <SettingsPanelSection>
        <Text message="administration.general.settings.equipmentFamily.equipmentStatuses" />
      </SettingsPanelSection>
      <DataTable data={status} field={EquipmentFamily.Statuses} />
      <SettingsPanelSection>
        <Text message="administration.general.settings.equipmentFamily.locations" />
      </SettingsPanelSection>
      <DataTable data={locations} field={EquipmentFamily.Locations} />
    </SettingsPanel>
  );
};
export default EquipmentFamilySettingsPanel;

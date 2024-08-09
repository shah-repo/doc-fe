import { useFormikContext } from 'formik';
import { noop } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings, SystemTransactionsRule } from '../../../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CompanyLocation } from '../../../../form.builder/FBLotTransfers/types';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableSystemTransactionsRule, LocationField } from './types';

const PANEL_FIELD = 'systemTransactions';

const SystemTransactionsSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();
  const locations = useSelector(companySelectors.getAllLocations) ?? [];
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const rules = getFieldProps<SystemTransactionsRule[]>(PANEL_FIELD).value ?? [];

  const updateRuleActiveState = (rule: EditableSystemTransactionsRule, state: boolean) => {
    const updatedRules = rules.map(it => ({
      ...it,
      isActive: it.id === rule.id ? state : it.isActive,
    }));
    setFieldValue(PANEL_FIELD, updatedRules);
  };

  const updateRuleLocation = (rule: EditableSystemTransactionsRule, field: LocationField, location?: CompanyLocation) => {
    const locationToSet = location?.id ?? null;
    const updatedRules = rules.map(it => ({
      ...it,
      [field]: it.id === rule.id ? locationToSet : it[field],
    }));
    setFieldValue(PANEL_FIELD, updatedRules);
  };

  const schema = buildSchema({
    isActive,
    locations,
    onActiveStateChange: isActive ? updateRuleActiveState : undefined,
    onLocationChange: isActive ? updateRuleLocation : undefined,
    onDiscard: noop,
    onConfirm: noop,
  });

  const data = rules.map<EditableSystemTransactionsRule>(rule => ({
    ...rule,
    active: rule.isActive,
    from: locations.find(location => location.id === rule.from),
    to: locations.find(location => location.id === rule.to),
    [MODE_FIELD]: Mode.show,
  }));

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

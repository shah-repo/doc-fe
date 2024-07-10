import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import CompanyLocationSettingsPanel from './panels/CompanyLocations';
import EquipmentFamilySettingsPanel from './panels/EquipmentFamily';
import IntegrationsSettings from './panels/Integrations';
import MaterialDispositionSettings from './panels/MaterialDisposition';
import PrintingSettingsPanel from './panels/Printing';
import TrainingReminder from './panels/TrainingReminder';
import { GeneralSettingsTabs } from './types';

export const MAX_PANEL_WIDTH = 920;
export const SIDEBAR_WIDTH = 150;

export const panels = [
  {
    key: GeneralSettingsTabs.Printing,
    title: 'administration.general.settings.printing',
    component: PrintingSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.TrainingReminder,
    title: 'administration.general.settings.training.reminder',
    component: TrainingReminder,
  },
  {
    key: GeneralSettingsTabs.AR,
    title: 'administration.general.settings.ar',
    component: ApprovalRequestsSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.MD,
    title: 'administration.general.settings.md',
    component: MaterialDispositionSettings,
  },
  {
    key: GeneralSettingsTabs.Locations,
    title: 'administration.general.settings.locations.tab',
    component: CompanyLocationSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.Integrations,
    title: 'administration.general.settings.integrations',
    component: IntegrationsSettings,
  },
  {
    key: GeneralSettingsTabs.EF,
    title: 'administration.general.settings.equipmentFamily.tab',
    component: EquipmentFamilySettingsPanel,
  },
];

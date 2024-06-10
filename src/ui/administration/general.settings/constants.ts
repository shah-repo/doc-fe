import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import ApprovalRolesSettingsPanel from './panels/ApprovalRoles';
import EquipmentFamilySettingsPanel from './panels/EquipmentFamily';
import IntegrationsSettings from './panels/Integrations';
import MaterialDispositionSettings from './panels/MaterialDisposition';
import PrintingSettingsPanel from './panels/Printing';
import { GeneralSettingsTabs } from './types';

export const MAX_PANEL_WIDTH = 660;
export const SIDEBAR_WIDTH = 150;

export const panels = [
  {
    key: GeneralSettingsTabs.Printing,
    title: 'administration.general.settings.printing',
    component: PrintingSettingsPanel,
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
    key: GeneralSettingsTabs.Integrations,
    title: 'administration.general.settings.integrations',
    component: IntegrationsSettings,
  },
  {
    key: GeneralSettingsTabs.EF,
    title: 'administration.general.settings.equipmentFamily.tab',
    component: EquipmentFamilySettingsPanel,
  },
  {
    key: GeneralSettingsTabs.ApprovalRoles,
    title: 'administration.general.settings.approvalRoles.tab',
    component: ApprovalRolesSettingsPanel,
  },
];

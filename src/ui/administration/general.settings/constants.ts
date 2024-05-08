import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import EquipmentFamilySettingsPanel from './panels/EquipmentFamily';
import IntegrationsSettings from './panels/Integrations';
import MaterialDispositionSettings from './panels/MaterialDisposition';
import PrintingSettingsPanel from './panels/Printing';
import ExpiredLots from './panels/WorkOrder/ExpiredLots';
import LotAutoAllocationOrder from './panels/WorkOrder/LotAutoAllocationOrder';
import { GeneralSettingsTabs } from './types';

export const MAX_PANEL_WIDTH = 660;
export const SIDEBAR_WIDTH = 180;

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
    key: GeneralSettingsTabs.LotAutoAllocationOrder,
    title: 'administration.general.settings.lot.auto.allocation.order',
    component: LotAutoAllocationOrder,
  },
  {
    key: GeneralSettingsTabs.ExpiredLots,
    title: 'administration.general.settings.expired.lots',
    component: ExpiredLots,
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

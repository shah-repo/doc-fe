import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import CompanyLocationSettingsPanel from './panels/CompanyLocations';
import EquipmentFamilySettingsPanel from './panels/EquipmentFamily';
import IntegrationsSettings from './panels/Integrations';
import LCPSettings from './panels/LCP';
import MaterialDispositionSettings from './panels/MaterialDisposition';
import MaterialFlowSettingsPanel from './panels/MaterialFlow';
import PrintingSettingsPanel from './panels/Printing';
import SystemTransactionsSettingsPanel from './panels/SystemTransactions';
import TrainingReminder from './panels/TrainingReminder';
import ExpiredLots from './panels/WorkOrder/ExpiredLots';
import LotAutoAllocationOrder from './panels/WorkOrder/LotAutoAllocationOrder';
import { GeneralSettingsTabs } from './types';

export const SIDEBAR_WIDTH = 180;

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
    key: GeneralSettingsTabs.Locations,
    title: 'administration.general.settings.locations.tab',
    component: CompanyLocationSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.MaterialFlow,
    title: 'administration.general.settings.material.flow',
    component: MaterialFlowSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.SystemTransactions,
    title: 'administration.general.settings.system.transactions',
    component: SystemTransactionsSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.LCP,
    title: 'administration.general.settings.lcp',
    component: LCPSettings,
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

import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
import ApprovalRolesSettingsPanel from './panels/ApprovalRoles';
import CompanyLocationSettingsPanel from './panels/CompanyLocations';
import EquipmentFamilySettingsPanel from './panels/EquipmentFamily';
import IntegrationsSettings from './panels/Integrations';
import LCPSettings from './panels/LCP';
import LHRBuildSettingsPanel from './panels/LHRBuild';
import LHRBuildSwitchSettingsPanel from './panels/LHRBuildTypeSwitchConfig';
import MaterialDispositionSettings from './panels/MaterialDisposition';
import MaterialFlowSettingsPanel from './panels/MaterialFlow';
import PrintingSettingsPanel from './panels/Printing';
import ASLStatusSettings from './panels/SupplierSettings/ASLStatus';
import SupplierConfiguration from './panels/SupplierSettings/SupplierConfiguration';
import SystemTransactionsSettingsPanel from './panels/SystemTransactions';
import TaxRateSettings from './panels/TaxRate';
import TimezoneSettings from './panels/Timezone';
import Training from './panels/Training';
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
    key: GeneralSettingsTabs.Training,
    title: 'administration.general.settings.training',
    component: Training,
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
    key: GeneralSettingsTabs.LHRBuild,
    title: 'administration.general.settings.lhr.build.menu.tab',
    component: LHRBuildSettingsPanel,
  },
  {
    key: GeneralSettingsTabs.LHRBuildSwitch,
    title: 'administration.general.settings.lhr.build.switch.menu.tab',
    component: LHRBuildSwitchSettingsPanel,
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
    key: GeneralSettingsTabs.SupplierConfiguration,
    title: 'administration.general.settings.suppliers.configuration',
    component: SupplierConfiguration,
  },
  {
    key: GeneralSettingsTabs.ASLStatus,
    title: 'administration.general.settings.suppliers.asl.status',
    component: ASLStatusSettings,
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
  {
    key: GeneralSettingsTabs.Timezone,
    title: 'administration.general.settings.timezone.title',
    component: TimezoneSettings,
  },
  {
    key: GeneralSettingsTabs.TaxRate,
    title: 'administration.general.settings.tax.rate',
    component: TaxRateSettings,
  },
];

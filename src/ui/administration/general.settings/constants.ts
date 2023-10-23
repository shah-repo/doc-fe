import ApprovalRequestsSettingsPanel from './panels/ApprovalRequest';
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
];

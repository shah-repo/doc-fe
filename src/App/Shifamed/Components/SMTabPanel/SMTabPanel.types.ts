import { SMBoxProps, SMFormProps, SMTabsHOCProps } from '../../..';

export type SMTabPanelProps =
& Pick<SMTabsHOCProps, '_tabsState'>
& {
  tabId: string
  tabIndex?: number
  children: SMFormProps['children']
  panelProps?: SMBoxProps
};

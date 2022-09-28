import { SMBoxProps, SMFormProps, SMTabsHOCProps } from "../../..";

export type SMTabPanelProps =
& Pick<SMTabsHOCProps, "_tabsState">
& {
  tabId: string;
  children: SMFormProps["children"];
  panelProps?: SMBoxProps;
};

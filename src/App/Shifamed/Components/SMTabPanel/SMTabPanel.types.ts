import { SMBoxProps, SMFormProps, SMTabsHOCProps } from "../../..";

export type SMTabPanelProps =
& Pick<SMTabsHOCProps, "_tabsState">
& {
  index: number;
  children: SMFormProps["children"];
  panelProps?: SMBoxProps;
};

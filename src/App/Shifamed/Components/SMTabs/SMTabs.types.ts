import { TabsTypeMap } from "@material-ui/core/Tabs/Tabs";
import { SMBoxProps, SMProviderProps } from "../../..";

export type SMTabsHOCProps = Pick<SMProviderProps, "_tabsState">;

export type SMTabsProps = SMTabsHOCProps & {
  onChange?: TabsTypeMap["props"]["onChange"];
  tabs: string[];
  children: React.ReactNode;
  boxProps?: SMBoxProps;
  panelProps?: SMBoxProps;
};

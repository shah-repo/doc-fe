import { TabsTypeMap } from "@material-ui/core/Tabs/Tabs";
import { SMBoxProps, SMProviderProps } from "../../..";
import { TabInfo } from "../../../../state/ducks/documentRevisions/documentType/types";

export type SMTabsHOCProps = Pick<SMProviderProps, "_tabsState">;

export type SMTabsProps = SMTabsHOCProps & {
  onChange?: TabsTypeMap["props"]["onChange"];
  tabs: TabInfo[];
  children: React.ReactNode;
  boxProps?: SMBoxProps;
  panelProps?: SMBoxProps;
};

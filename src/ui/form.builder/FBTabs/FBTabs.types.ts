import { TabsProps } from "@material-ui/core";
import { FBSwitchPanelProps } from "..";

export type FBTabsProps =
  & Pick<Partial<TabsProps>, "value" | "onChange">
  & FBSwitchPanelProps
  & {
    tabs?: React.ReactNode[];
    activeTab?: number;
  };

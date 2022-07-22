import { SMBoxProps, SMProviderProps } from "../../..";

export type SMTabsProps =
& SMTabsHOCProps
& {
  onChange: (event: any, newValue: number) => void;
  tabs: string[];
  children: React.ReactNode;
  boxProps?: SMBoxProps;
  tabProps?: SMBoxProps;
  panelProps?: SMBoxProps;
};

export interface SMTabsStateProps {
  setValue: (value: number) => void;
  value: number;
}

export type SMTabsHOCProps = Pick<SMProviderProps, "_tabsState">;

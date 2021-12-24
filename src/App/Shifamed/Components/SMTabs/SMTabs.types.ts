import { BoxProps } from "@material-ui/core";
import { SMProviderProps } from "../../..";

export type SMTabsProps =
& SMTabsHOCProps
& {
  onChange: (event: any, newValue: number) => void;
  tabs: string[];
  children: React.ReactNode[];
  boxProps?: BoxProps;
};

export interface SMTabsStateProps {
  setValue: (value: number) => void;
  value: number;
}

export type SMTabsHOCProps = Pick<SMProviderProps, "_tabsState">;

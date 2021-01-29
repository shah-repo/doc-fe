import { TooltipProps } from "@material-ui/core";
import { TooltipLabelConfig } from "../../../state/ducks/documentRevisions/documentType";
import { Validator } from "../../components/forms/fields/validators";

export interface UIConfig {
  isVisible: boolean;
  label?: string;
  tooltipConfig?: TooltipLabelConfig;
  validation?: Validator;
}

export interface ConditionalWrapperProps {
  condition?: boolean;
  wrapper: (children: React.ReactNode | React.ReactNode[]) => any;
  children: React.ReactNode | React.ReactNode[];
}

export type CustomLabelTooltipProps = Omit<TooltipProps, "children" | "title"> & {
  children?: TooltipProps["children"] | string | number;
  tooltipConfig?: TooltipLabelConfig;
};

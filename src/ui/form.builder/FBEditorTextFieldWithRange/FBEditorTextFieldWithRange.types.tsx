import { FBEditorProps, FBPassPercentageValue, FBRangeValue } from "..";

export enum FBPassType {
  percentage = "percentage",
  value = "value",
}

export interface FBPassValue {
  type?: string;
  value?: FBRangeValue;
  percentage?: FBPassPercentageValue;
}

export interface FBEditorTextFieldWithRangeConfig {
  rangeOption?: boolean;
  passValue?: boolean;
  range?: FBRangeValue;
  criticalToQuality?: boolean;
  inspection?: boolean;
  pass?: FBPassValue;
}

export type FBEditorTextFieldWithRangeProps =
& FBEditorProps
& {
  editorConfig?: FBEditorTextFieldWithRangeConfig;
};

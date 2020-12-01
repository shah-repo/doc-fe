import { FBEditorProps, FBOption, FBPassPercentageValue, FBRangeValue } from "..";

export interface FBPassValue {
  type?: string;
  value?: FBRangeValue;
  percentage?: FBPassPercentageValue;
}

export interface FBEditorTextFieldWithRangeConfig {
  range?: FBRangeValue;
  criticalToQuality?: boolean;
  inspection?: boolean;
  pass?: FBPassValue;
}

export type FBEditorTextFieldWithRangeProps =
& FBEditorProps
& {
  aqlOptions: FBOption[];
  editorConfig?: FBEditorTextFieldWithRangeConfig;
};

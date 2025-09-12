import { FBEditorProps, FBPassPercentageValue, FBRangeValue } from '..';

export enum FBPassType {
  percentage = 'percentage',
  value = 'value',
}

export interface FBPassValue {
  type?: string
  value?: FBRangeValue
  percentage?: FBPassPercentageValue
}

export interface FBEditorTextFieldWithRangeConfig {
  aql?: string
  criticalToQuality?: boolean
  rangeOption?: boolean
  range?: FBRangeValue
  toleranceOption?: boolean
  tolerance?: number
  inspection?: boolean
  passValue?: boolean
  pass?: FBPassValue
}

export type FBEditorTextFieldWithRangeProps =
& FBEditorProps
& {
  editorConfig?: FBEditorTextFieldWithRangeConfig
};

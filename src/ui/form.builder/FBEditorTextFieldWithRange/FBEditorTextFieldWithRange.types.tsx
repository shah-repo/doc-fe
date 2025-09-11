import { FBEditorProps, FBPassPercentageValue, FBRangeValue } from '..';

export enum FBPassType {
  percentage = 'percentage',
  value = 'value',
}

interface FBPassValue {
  type?: string
  value?: FBRangeValue
  percentage?: FBPassPercentageValue
}

interface FBEditorTextFieldWithRangeConfig {
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

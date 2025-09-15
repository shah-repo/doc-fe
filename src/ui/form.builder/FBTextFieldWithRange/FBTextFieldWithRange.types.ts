import { FBEditorTextFieldWithRangeConfig, FBRangeValue, FBTextFieldProps } from '..';

export interface ChipComponentProps {
  label: string
  tooltip: string
  isActive?: boolean
  className?: string
  onChange?: (isActive: boolean) => void
}

export interface FBTextFieldWithRangeValue {
  value: number
  unit: string
  isFaiRequired: boolean
  isIqcRequired: boolean
}

export interface FBTextFieldWithRangeProps extends FBTextFieldProps {
  range?: FBRangeValue
  pass?: FBRangeValue
  tolerance?: number
  aql?: string
  rules?: string
  includeInFaiInspection?: boolean
  criticalToQuality?: boolean
  isPartFaiRequired?: boolean
  isPartIqcRequired?: boolean
  value?: FBTextFieldWithRangeValue
  editorConfig: FBEditorTextFieldWithRangeConfig
  onUpdate?: (value: Partial<FBTextFieldWithRangeValue>) => void
}

export type UseOptionsHook = () => {
  units: string[]
  isLoading: boolean
};

export interface UnitOption {
  value: string
  text: string
}

import { FBEditorTextFieldWithRangeConfig, FBRangeValue, FBTextFieldProps } from '..';

export interface ChipComponentProps {
  label: string
  tooltip: string
  isActive?: boolean
  className?: string
  isDisabled?: boolean
  onChange?: (isActive: boolean) => void
}

export interface FBTextFieldWithRangeValue {
  value: number | string
  unit: string
  isFaiRequired: boolean
  isIqcRequired: boolean
}

export interface FBTextFieldWithRangeProps extends FBTextFieldProps {
  hasUnits?: boolean
  hasRange?: boolean
  hasTolerance?: boolean
  isCriticalToQuality?: boolean
  isInspected?: boolean
  range?: FBRangeValue
  tolerance?: number
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

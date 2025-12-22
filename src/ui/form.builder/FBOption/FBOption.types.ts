export interface FBOption<T = string> {
  text: string
  value: T
  disabled?: boolean
}

export type FBOptionValueType = 'object' | 'key' | 'id';

export interface FBOptionProps {
  options?: Array<Record<any, any>> | FBOption[] | string[]
  optionLabelKey?: string
  optionValueKey?: string
  optionValueType?: FBOptionValueType
  optionId?: string
}

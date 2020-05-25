export interface FBOption {
  text: string;
  value: string;
}

export type FBOptionValueType =  "object" | "key" | "id";

export interface FBOptionProps {
  options?: Record<any, any>[] | FBOption[] | string[];
  optionLabelKey?: string;
  optionValueKey?: string;
  optionValueType?: FBOptionValueType;
  optionId?: string;
}

export interface FBOption {
  text: string;
  value: string;
}

export interface FBOptionProps {
  options?: Record<any, any>[] | FBOption[] | string[];
  optionLabelKey?: string;
  optionValueKey?: string;
  optionValueType?: "object" | "key";
  optionId?: string;
}

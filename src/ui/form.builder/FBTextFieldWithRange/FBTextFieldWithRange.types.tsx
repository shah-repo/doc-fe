import { FBPassPercentageValue, FBRangeValue, FBTextFieldProps } from "..";

export type FBTextFieldWithRangeProps =
& FBTextFieldProps
& {
  range?: FBRangeValue;
  pass?: FBRangeValue;
  aql?: string;
  fai?: boolean;
};

export interface FBPassValueRange {
  type: "percentage" | "value";
  percentage?: FBPassPercentageValue;
  value?: FBRangeValue;
}

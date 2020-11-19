import { RadioGroupProps } from "@material-ui/core";
import { FBInputProps, FBOptionProps } from "..";

export type FBRadioGroupProps =
& FBOptionProps
& Pick<FBInputProps, "onChange" | "name" | "label" | "disabled" | "defaultValue"| "rules">
& Pick<RadioGroupProps, "row">
& {
  controls?: React.ReactNode[];
};

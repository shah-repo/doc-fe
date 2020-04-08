import { FormGroupProps } from "@material-ui/core";
import { FBInputProps, FBOptionProps } from "..";

export type FBCheckboxGroupProps =
  & FBOptionProps
  & Partial<Pick<FBInputProps, "onChange" | "name" | "label" | "disabled">>
  & Pick<FormGroupProps, "row">
  & {
    controls?: React.ReactNode[];
  };

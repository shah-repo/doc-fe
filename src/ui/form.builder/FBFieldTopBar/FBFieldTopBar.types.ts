import { BoxProps } from "@material-ui/core";
import { FBEditorHelperProps, FBInputProps } from "..";

export type FBFieldTopBarProps =
  & Pick<FBInputProps, "index">
  & Pick<BoxProps, "visibility" | "mb">
  & FBEditorHelperProps
  & {
    editSchemaItem?: () => any;
    removeSchemaItem?: () => any;
    markDownSchemaItem?: () => any;
  };

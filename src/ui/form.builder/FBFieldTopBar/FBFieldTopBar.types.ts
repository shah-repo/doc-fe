import { BoxProps } from "@material-ui/core";
import { FBEditorHelperProps, FBInputProps } from "..";

export type FBFieldTopBarProps =
  & Pick<BoxProps, "visibility">
  & FBEditorHelperProps
  & {
    editSchemaItem?: () => any;
    removeSchemaItem?: () => any;
    markDownSchemaItem?: () => any;
    inputProps?: Partial<FBInputProps>;
  };

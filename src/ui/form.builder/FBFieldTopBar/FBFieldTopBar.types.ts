import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState } from "..";
import { FBInputProps } from "../types/common";

export type FBFieldTopBarProps =
  & Pick<FBInputProps, "index">
  & Pick<BoxProps, "visibility" | "mb">
  & {
    editSchemaItem?: () => any;
    removeSchemaItem?: () => any;
    markDownSchemaItem?: () => any;
    fieldWrapper?: FBFieldWrapperState;
  };

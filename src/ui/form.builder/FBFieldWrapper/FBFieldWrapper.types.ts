import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState } from ".";
import { FBFormProps, FBInputProps } from "..";

export type FBFieldWrapperProps =
  & Pick<FBFormProps, "children">
  & Pick<BoxProps, "onMouseOver" | "onMouseLeave">
  & {
    fieldWrapperState?: FBFieldWrapperState;
    toolsVisible?: "visible" | "hidden";
    addToolVisible?: "visible" | "hidden";
    markDownVisible?: boolean;
    topBarMargin?: number;
    grabMargin?: number;
    inputProps?: Partial<FBInputProps>;
  };


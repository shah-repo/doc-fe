import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState } from ".";
import { FBFormProps, FBInputProps, FBVisibilityType } from "..";

export type FBFieldWrapperProps =
  & Pick<FBFormProps, "children">
  & Pick<BoxProps, "onMouseOver" | "onMouseLeave">
  & {
    fieldWrapperState?: FBFieldWrapperState;
    toolsVisible?: FBVisibilityType;
    addToolVisible?: FBVisibilityType;
    markDownVisible?: boolean;
    topBarMargin?: number;
    grabMargin?: number;
    inputProps?: Partial<FBInputProps>;
  };


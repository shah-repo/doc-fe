import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState } from ".";
import { FBInputProps } from "../types/common";

export type FBFieldWrapperProps =
  & Pick<FBInputProps, "index" | "children" | "designDisabled">
  & Pick<BoxProps, "onMouseOver" | "onMouseLeave">
  & {
    fieldWrapperState?: FBFieldWrapperState;
    toolsVisible?: "visible" | "hidden";
    addToolVisible?: "visible" | "hidden";
    markDownVisible?: boolean;
    topBarMargin?: number;
    grabMargin?: number;
  };


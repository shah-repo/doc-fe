import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState } from ".";
import { FBStateProps } from "../helpers/FBStateProps";
import { FBInputProps } from "../types/common";

export type FBFieldWrapperProps =
  & Pick<FBInputProps, "index" | "children">
  & Pick<BoxProps, "onMouseOver" | "onMouseLeave">
  & FBStateProps<FBFieldWrapperState>
  & {
    toolsVisible?: "visible" | "hidden";
    markDownVisible?: boolean;
    topBarMargin?: number;
    bottomBarMargin?: number;
  };

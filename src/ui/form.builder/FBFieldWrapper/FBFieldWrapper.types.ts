import { BoxProps } from "@material-ui/core";
import { FBFieldWrapperState, FBFormProps, FBInputProps, FBVisibilityType } from "..";

export type FBFieldWrapperProps =
  & Pick<FBFormProps, "children">
  & Pick<BoxProps, "onMouseOver" | "onMouseLeave" | "mt" | "mb">
  & {
    fieldWrapperState?: FBFieldWrapperState;
    toolsVisible?: FBVisibilityType;
    addToolVisible?: FBVisibilityType;
    markDownVisible?: boolean;
    inputProps?: Partial<FBInputProps>;
    isDragged?: boolean;
    position: number;
  };

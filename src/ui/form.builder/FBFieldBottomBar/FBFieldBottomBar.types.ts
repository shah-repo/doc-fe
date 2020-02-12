import { BoxProps } from "@material-ui/core";
import { FBButtonProps } from "../types/button";
import { FBInputProps } from "../types/common";

export type FBFieldBottomBarProps =
  & Pick<FBInputProps, "index">
  & Pick<BoxProps, "visibility" | "mt">
  & Pick<FBButtonProps, "onClick">;

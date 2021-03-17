import { BoxProps } from "@material-ui/core";
import { FBStarterProps } from "..";
import { FBInputProps } from "../types/common";

export type FBFieldBottomBarProps =
  & Pick<FBInputProps, "index">
  & Pick<BoxProps, "visibility" | "mt">
  & FBStarterProps;

import { BoxProps } from "@material-ui/core";
import { FBInputProps } from "../types/common";

export type FBFieldMarkDownProps =
  & Pick<FBInputProps, "index">
  & Pick<BoxProps, "mt" | "mb">
  & {
    source?: string;
  };

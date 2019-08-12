import { RenderSize } from "../../../../../state/ducks/common";

export enum HeaderSize {
  sm = "subtitle1",
  md = "h5",
  lg = "h4",
}

export interface HeaderFieldProps {
  size?: RenderSize;
  variant?: "regular" | "dense";
  actionsRenderer?: () => any;
}

export interface HeaderFieldStyleProps {
  variant: "regular" | "dense";
}

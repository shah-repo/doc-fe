import { RenderSize } from "../../../../../state/ducks/common";

export enum HeaderSize {
  sm = "subtitle1",
  md = "h5",
  lg = "h4",
}

export interface HeaderFieldProps {
  size?: RenderSize;
  actionsRenderer?: () => any;
}

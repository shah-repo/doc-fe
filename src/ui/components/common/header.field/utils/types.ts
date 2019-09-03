import { RenderSize, RenderColor } from "../../../../../state/ducks/common";

export interface HeaderFieldProps {
  size?: RenderSize;
  color?: RenderColor;
  variant?: "regular" | "dense";
  actionsRenderer?: () => any;
}

export interface HeaderFieldStyleProps {
  variant: "regular" | "dense";
  size: RenderSize;
}

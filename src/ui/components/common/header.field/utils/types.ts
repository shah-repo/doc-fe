import { RenderSize } from "../../../../../state/ducks/common";

export interface HeaderFieldProps {
  size?: RenderSize;
  variant?: "regular" | "dense";
  actionsRenderer?: () => any;
}

export interface HeaderFieldStyleProps {
  variant: "regular" | "dense";
  size: RenderSize;
}

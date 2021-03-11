import { BoxProps } from "@material-ui/core";

export interface FBIconProps {
  icon: FBIconType | FBIconConfig[];
  boxProps?: BoxProps;
  children?: React.ReactNode | React.ReactNode[];
  text?: string;
}

export type FBIconType =
| "Attachment";

export interface FBIconConfig {
  path: string;
  fill?: string;
}

export interface FBViewAttachmentIconProps {
  text?: string;
}

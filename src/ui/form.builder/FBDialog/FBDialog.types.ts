import { DialogProps, SvgIconProps } from "@material-ui/core";
import { FBDialogState } from ".";

export type FBDialogProps =
& Pick<Partial<DialogProps>, "open" | "maxWidth">
& {
  handleClose?: SvgIconProps["onClick"];
  handleActionsRef?: (instance: any) => any;
  handleTitleRef?: (instance: any) => any;
  dialogState?: FBDialogState;
  title?: React.ReactNode | string;
  content?: React.ReactElement;
  actions?: React.ReactNode;
  portalAction?: Element;
  portalTitle?: Element;
};

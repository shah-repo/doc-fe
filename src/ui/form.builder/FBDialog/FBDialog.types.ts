import { DialogProps, SvgIconProps } from "@material-ui/core";
import { ReactNode } from "react";
import { FBDialogState, FBLabelLocaleProps } from "..";

export type FBDialogProps =
& Pick<Partial<DialogProps>, "open" | "maxWidth">
& {
  handleClose?: SvgIconProps["onClick"];
  handleActionsRef?: (instance: any) => any;
  handleTitleRef?: (instance: any) => any;
  onClose?: () => any;
  dialogState?: FBDialogState;
  title?: string | ReactNode | FBLabelLocaleProps;
  content?: React.ReactElement;
  actions?: React.ReactNode;
  portalAction?: Element;
  portalTitle?: Element;
};

import { DialogProps, SvgIconProps } from "@material-ui/core";
import { ReactNode } from "react";
import { FBLabelLocaleProps } from "..";
import FBLeftPanelDialogState from "./FBLeftPanelDialog.state";

export type FBDialogProps =
& Pick<Partial<DialogProps>, "open" | "maxWidth">
& {
  handleClose?: SvgIconProps["onClick"];
  handleActionsRef?: (instance: any) => any;
  handleTitleRef?: (instance: any) => any;
  onClose?: () => any;
  leftPanelDialogState?: FBLeftPanelDialogState;
  title?: string | ReactNode | FBLabelLocaleProps;
  content?: React.ReactElement;
  actions?: React.ReactNode;
  portalAction?: Element;
  portalTitle?: Element;
  showLeftPanelEditor?: boolean;
};

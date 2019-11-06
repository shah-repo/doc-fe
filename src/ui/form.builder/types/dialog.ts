import { DialogProps } from "@material-ui/core/Dialog";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Translation } from "../../translations/types";

export interface FBDialogStateProps {
  open: boolean;
  content?: React.ReactNode;
  title?: string | Translation | false;
}

export interface FBDialogInjectedProps {
  open: boolean;
  content?: React.ReactNode;
  title?: string | Translation | false;
  setDialogOpen?: () => any;
  setDialogClose: () => any;
  setDialogContent?: (content: React.ReactNode, title?: string | Translation | false) => any;
}

export enum FBDialogActionLabel {
  create = "common.create",
}

export type FBDialogAction = "create";

export interface FBDialogProps extends
  Omit<DialogProps, "title">,
  FBDialogInjectedProps {
  maxWidth?: Breakpoint;
  actions?: FBDialogAction[] | false;
  onActionClick?: (action: FBDialogAction) => any;
}

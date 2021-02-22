import { DialogProps } from "@material-ui/core/Dialog";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Translation } from "../../translations/types";

export enum FBDialogActionLabel {
  create = "common.create",
}

export type FBDialogAction = "create";

export interface FBDialogProps extends
  Pick<DialogProps, "fullScreen" | "children"> {
  open?: boolean;
  content?: React.ReactNode;
  title?: string | Translation | false;
  setDialogOpen?: () => any;
  setDialogClose?: () => any;
  setDialogContent?: (content: React.ReactNode, title?: string | Translation | false) => any;
  maxWidth?: Breakpoint;
  actions?: FBDialogAction[] | false;
  onActionClick?: (action: FBDialogAction) => any;
}

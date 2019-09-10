import { DialogProps } from "@material-ui/core/Dialog";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Translation } from "../../../../translations/types";

export interface FBDialogInjectedProps {
  open: boolean;
  setDialogOpen: () => any;
  setDialogClose: () => any;
}

export enum FBDialogActionLabel {
  create = "common.create",
}

export type FBDialogAction = "create";

export interface FBDialogProps extends DialogProps, FBDialogInjectedProps {
  title?: string | Translation;
  maxWidth?: Breakpoint;
  actions?: FBDialogAction[];
  onActionClick?: (action: FBDialogAction) => any;
}

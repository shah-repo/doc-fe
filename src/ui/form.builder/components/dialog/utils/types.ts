import { DialogProps } from "@material-ui/core/Dialog";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Translation } from "../../../../translations/types";

export interface FBDialogInjectedProps {
  open: boolean;
  setDialogOpen: () => any;
  setDialogClose: () => any;
  setDialogChildren: (el: JSX.Element) => any;
}

export enum FBDialogActionLabel {
  create = "common.create",
}

export type FBDialogAction = "create";

export interface FBDialogProps extends
  Omit<DialogProps, "title">,
  FBDialogInjectedProps {
  title?: string | Translation | false;
  maxWidth?: Breakpoint;
  actions?: FBDialogAction[];
  onActionClick?: (action: FBDialogAction) => any;
}

import { DialogProps } from "@material-ui/core/Dialog";
import { DialogHandler as DialogHandlerHook } from "../../../hooks/useDialog";
import { Translation } from "../../../translations/types";

type DialogBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type DialogContentRenderer = () => any;
type DialogHandler = (action: DialogAction) => any;

export enum DialogAction {
  Close = "common.close",
  Agree = "common.agree",
  Disagree = "common.disagree",
  Cancel = "common.cancel",
  Ok = "common.ok",
  Confirm = "common.confirm",
}

export interface DialogResponsiveProps extends Partial<DialogProps> {
  breakpoint?: DialogBreakpoint;
  title?: Translation | string;
  contentRenderer?: DialogContentRenderer;
  actions?: DialogAction[];
  onActionClick?: DialogHandler;
  dialogHandler: DialogHandlerHook;
}

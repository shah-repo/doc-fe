import { DialogProps } from "@material-ui/core/Dialog";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { Translation } from "../../../../translations/types";

export interface FBInjectedProps {
  open: boolean;
  setOpen: () => any;
  setClose: () => any;
}

export interface FBDialogProps extends DialogProps, FBInjectedProps {
  title?: string | Translation;
}

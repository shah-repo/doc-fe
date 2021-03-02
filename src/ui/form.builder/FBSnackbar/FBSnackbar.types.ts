import { SnackbarProps } from "@material-ui/core";
import { FBFormProps, FBSnackbarState } from "..";

export type FBSnackbarProps =
& Pick<SnackbarProps, "onClose" | "anchorOrigin" | "autoHideDuration" | "action">
& Pick<FBFormProps, "children">
& {
  snackbarState?: FBSnackbarState;
  message?: string;
  open?: boolean;
};

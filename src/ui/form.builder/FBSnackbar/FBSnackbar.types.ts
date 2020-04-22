import { SnackbarProps } from "@material-ui/core";
import { FBSnackbarState } from ".";
import { FBFormProps } from "../FBForm";

export type FBSnackbarProps =
& Pick<SnackbarProps, "onClose" | "anchorOrigin" | "autoHideDuration" | "action">
& Pick<FBFormProps, "children">
& {
  snackbarState?: FBSnackbarState;
  message?: string;
  open?: boolean;
};

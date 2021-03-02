import { Snackbar } from "@material-ui/core";
import React from "react";
import { FBSnackbarProps } from "..";
import { withFBSnackbar } from "./FBSnackbar.wrap";

const FBSnackbar: React.FunctionComponent<FBSnackbarProps> = ({
  onClose,
  autoHideDuration,
  open = false,
  anchorOrigin,
  message,
  action,
}) => (
  <Snackbar
    {...{ onClose, open, action, message, anchorOrigin, autoHideDuration }}
  />
);

export default withFBSnackbar(FBSnackbar);

import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import React from "react";
import Text from "../../components/Text";
import { FBDialogProps } from "./FBDialog.types";
import { withFBDialog } from "./FBDialog.wrap";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  open = false,
  title,
  content = "",
  actions,
  maxWidth,
  onCloseClick,
}) => (
  <Dialog
    fullWidth={true}
    fullScreen={useMediaQuery(useTheme().breakpoints.down(maxWidth || "sm"))}
    {...{ open, maxWidth }}
    style={{ zIndex: 10000000 }}
    scroll="paper"
  >
    <DialogTitle>
      <Box display="flex" flexDirection="row-reverse">
        <CloseIcon fontSize="large" onClick={onCloseClick} />
      </Box>
      {_.isString(title) && (
        <Box fontWeight="fontWeightBold" textAlign="center">
          <Text message={title} />
        </Box>)}
      {!_.isString(title) && title}
    </DialogTitle>
    <DialogContent>
      {content}
    </DialogContent>
    {actions && (
      <DialogActions>
        <Box px={2}>{actions}</Box>
      </DialogActions>
    )}
  </ Dialog>
);

export default withFBDialog(FBDialog);

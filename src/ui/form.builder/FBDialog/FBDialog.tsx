import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Portal } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import React from "react";
import Text from "../../components/Text";
import { FBDialogProps } from "./FBDialog.types";
import { withFBDialog } from "./FBDialog.wrap";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  handleActionsRef,
  handleTitleRef,
  handleClose,
  portalAction,
  portalTitle,
  open = false,
  title,
  content,
  actions,
  maxWidth,
}) => (
  <Dialog
    fullWidth={true}
    fullScreen={useMediaQuery(useTheme().breakpoints.down(maxWidth || "sm"))}
    {...{ open, maxWidth }}
  >
    <DialogTitle>
      <Box display="flex" flexDirection="row-reverse">
        <CloseIcon fontSize="large" onClick={handleClose} />
      </Box>
      {_.isString(title) && (
        <Box fontWeight="fontWeightBold" textAlign="center">
          <Text message={title} />
        </Box>
      )}
      {!_.isString(title) && <div ref={handleTitleRef} />}
    </DialogTitle>
    <DialogContent>
      {content && (
        <content.type {...content.props}>
          {content.props.children}
          {!_.isString(title) && (
            <Portal container={portalTitle}>
              {title}
            </Portal>
          )}
          <Portal container={portalAction}>
            {actions}
          </Portal>
        </content.type>
      )}
    </DialogContent>
    <DialogActions>
      <div ref={handleActionsRef} />
    </DialogActions>
  </ Dialog>
);

export default withFBDialog(FBDialog);

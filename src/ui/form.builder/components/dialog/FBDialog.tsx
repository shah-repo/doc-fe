import { Box, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../components/Text";
import { FBDialogProps } from "./utils/types";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  title,
  setClose,
  ...props
}) => (
  <Dialog {...props}>
    <DialogTitle>
      <Box display="inline">
        <CloseIcon fontSize="large" onClick={setClose} />
      </Box>
      <Box
        pl={2}
        pr={2}
        display="inline"
        textAlign="center"
        fontWeight="fontWeightBold"
        fontSize="h6.fontSize"
      >
        <Text message={title} />
      </Box>
    </DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
  </Dialog>
);

export default FBDialog;

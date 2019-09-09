import { Box, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../components/Text";
import { withDialogActions, withDialogSettings } from "./utils/hoc";
import { FBDialogProps } from "./utils/types";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  title,
  setDialogClose,
  ...props
}) => (
  <Dialog fullWidth={true} {...props}>
    <DialogTitle>
      <CloseIcon fontSize="large" onClick={setDialogClose} />
      <Box
        mt={-3}
        textAlign="center"
        fontWeight="fontWeightBold"
        fontSize="h6.fontSize"
        width={1}
      >
        <Text message={title} />
      </Box>
    </DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
  </Dialog>
);

export default withDialogActions(withDialogSettings(FBDialog));

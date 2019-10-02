import { Box, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../components/Text";
import { withDialogActions, withDialogDefaults } from "./utils/hoc";
import { FBDialogProps } from "./utils/types";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  title = false,
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
        {title && <Text message={title as string} />}
      </Box>
    </DialogTitle>
    <DialogContent>
      {props.children}
    </DialogContent>
  </Dialog>
);

export default withDialogActions(withDialogDefaults(FBDialog));

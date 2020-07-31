import { Box, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../components/Text";
import { withDialogActions } from "../../hocs/withDialogActions";
import { withDialogDefaults } from "../../hocs/withDialogDefaults";
import { FBDialogProps } from "../../types/dialog";

const FBDialog: React.FunctionComponent<FBDialogProps> = ({
  title,
  setDialogClose,
  content,
  ...props
}) => (
  <Dialog fullWidth={true} {...props} open={props.open || false}>
    <DialogTitle>
      <CloseIcon fontSize="large" onClick={setDialogClose} id="FBDialog-closeDialog" />
      <Box
        mt={-3}
        textAlign="center"
        fontWeight="fontWeightBold"
        fontSize="h6.fontSize"
        width={1}
      >
        {title && <Text message={title} />}
      </Box>
    </DialogTitle>
    <DialogContent>
      <Box px={4} pb={2} pt={title ? 0 : 2} id="FBDialog-content" >
        {content || props.children}
      </Box>
    </DialogContent>
  </Dialog>
);

export default withDialogActions(withDialogDefaults(FBDialog));

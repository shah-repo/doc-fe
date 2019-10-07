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
      <Box px={4} pb={2} pt={!title && 2}>
        {content || props.children}
      </Box>
    </DialogContent>
  </Dialog>
);

export default withDialogActions(withDialogDefaults(FBDialog));

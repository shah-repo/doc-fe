import { Box, Button, Dialog, DialogContent } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { DialogHandler } from "../../../../hooks/useDialog";

interface Props {
  dialog: DialogHandler;
  onUpgradeClick: () => void;
}

export const UpgradeToLatestDialog: React.FunctionComponent<Props> = ({
  dialog,
  onUpgradeClick,
}) => (
  <Dialog
    disableEscapeKeyDown={true}
    disableBackdropClick={true}
    fullWidth={true}
    maxWidth="sm"
    open={dialog.isOpen}
    id="UpgradeToLatest-dialog"
  >
    <DialogContent
      id="UpgradeToLatest-content"
    >
      <Box padding={3}>
        <Text translation="document.revision.upgrade.alert"/>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={onUpgradeClick}
          id="UpgradeToLatest-upgrade"
        >
          <Text translation="common.proceed"/>
        </Button>
        <Button
          variant="outlined"
          onClick={dialog.close}
          id="UpgradeToLatest-upgrade"
        >
          <Text translation="common.cancel"/>
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);
export default UpgradeToLatestDialog;

import { Box, Button, Dialog, DialogContent } from "@material-ui/core";
import React, { useEffect } from "react";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";

interface Props {
  showShouldUpgrade: boolean;
  setShouldDisplay?: (value: boolean) => void;
  onUpgradeClick: () => void;
}

export const UpgradeToLatestButton: React.FunctionComponent<Props> = ({
  setShouldDisplay,
  showShouldUpgrade,
  onUpgradeClick,
}) => {
  const dialog = useDialog();

  useEffect(() => {
    setShouldDisplay?.(showShouldUpgrade);
  }, [showShouldUpgrade, setShouldDisplay]);

  return (
    <>
      {
        showShouldUpgrade &&
        <>
          <Button
            variant="outlined"
            onClick={dialog.open}
            id="UpgradeToLatest-upgrade"
          >
            <Text translation="common.upgrade"/>
          </Button>
          {
            dialog.isOpen &&
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
          }
        </>
      }
    </>
  );
};

export default UpgradeToLatestButton;

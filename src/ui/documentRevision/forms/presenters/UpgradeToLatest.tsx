import { Box, Button, Dialog, DialogContent } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import useShouldUpgradeToLatest from "../../../hooks/useShouldUpgradeToLatest";

interface Props {
  documentStatus?: DocumentRevisionStatus;
  formDocumentId?: string;
  docRevId?: string;
  formDocumentStatus?: DocumentRevisionStatus;
  shouldDisplay: boolean;
  setShouldDisplay: (value: boolean) => void;
}

export const UpgradeToLatest: React.FunctionComponent<Props> = ({
  documentStatus,
  formDocumentId = "",
  docRevId,
  formDocumentStatus,
  setShouldDisplay,
}) => {

  const dispatch = useDispatch();
  const dialog = useDialog();
  const showShouldUpgrade = useShouldUpgradeToLatest(documentStatus, formDocumentStatus, formDocumentId);

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);

  useEffect(() => {
    setShouldDisplay(showShouldUpgrade);
  }, [showShouldUpgrade, setShouldDisplay]);

  const async = useAsync();
  const upgradeAction = useActionCreator(documentRevisionsActions.upgradeToReleasedForm);
  const onUpgradeClick = () => {
    async.start(upgradeAction, docRevId, async);
  };

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

export default UpgradeToLatest;

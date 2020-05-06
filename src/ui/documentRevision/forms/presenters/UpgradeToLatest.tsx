import { Box, Button, Dialog, DialogContent } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, DocumentRevision, documentRevisionsActions, documentRevisionsSelectors, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../../state/reducers";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import { getIsLastVersionObsolete } from "../../helpers";


interface Props {
  documentRevision?: DocumentRevision;
  onUpgradeClick: () => void;
}


export const UpgradeToLatest: React.FunctionComponent<Props> = ({
  onUpgradeClick,
  documentRevision,
}) => {
  const dispatch = useDispatch();
  const dialog = useDialog();
  const formDocumentStatus = documentRevision?.formDocument?.status || "";
  const isFormStatusDeprecated = formDocumentStatus === DocumentRevisionStatus.Deprecated;
  const documentStatus = documentRevision?.status;
  const formDocumentId = documentRevision?.formDocument?.document?.id || "";
  const isDocumentStatusDraftOrPending =
    documentStatus === (DocumentRevisionStatus.Draft || DocumentRevisionStatus.PendingChange);
  const formDocuments: Document = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocument(state, formDocumentId)
  );
  const isLastVersionObsolete = useMemo(() =>
    formDocuments && getIsLastVersionObsolete(formDocuments)
  , [formDocuments]);

  useEffect(() => {
    if (formDocumentId) {
      dispatch(documentRevisionsActions.loadDocument(formDocumentId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDocumentId]);


  return (
    <>
      {
        isFormStatusDeprecated &&
        isDocumentStatusDraftOrPending &&
        !isLastVersionObsolete &&
        <>
          <Button
            variant="outlined"
            onClick={dialog.open}
            id="UpgradeToLatest-upgrade"
          >
            <Text translation="common.upgrade"/>
          </Button>
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
        </>
      }
    </>
  );
};

export default UpgradeToLatest;

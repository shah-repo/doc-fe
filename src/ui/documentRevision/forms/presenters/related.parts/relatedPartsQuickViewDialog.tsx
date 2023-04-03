import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DialogHandler } from "../../../../hooks/useDialog";

import CloseIcon from "@material-ui/icons/Close";
import { ReactComponent as NewTabIcon } from "../../../../../assets/images/new_tab.svg";

import { DocumentRevisionSummary } from "../../../../../App";
import { DocumentRevision } from "../../../../../state/ducks/documentRevisions/types";
import { relatedPartsActions } from "../../../../../state/ducks/relatedParts";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useStyles from "./RelatedPart.styles";

interface Props {
  documentId: string;
  relatedSubPartDialog: DialogHandler;
  closeDialog: () => void;
  handleOpenNewTab: () => void;
  documentRevisionId: string;
}

const Loader = () => {
  const classes = useStyles();

  return (
    <div
      data-cy="ar-itemsloader"
      className={classes.loader}
    >
      <Text translation="common.loading" />
    </div>
  );
};

const RelatedPartsQuickViewDialog: React.FunctionComponent<Props> = ({
  documentId,
  relatedSubPartDialog,
  closeDialog,
  handleOpenNewTab,
  documentRevisionId,
}) => {

  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [documentRevision, setDocumentRevision] = useState<DocumentRevision>();

  const loadRelatedSubPartDocRevAction = useActionCreator(relatedPartsActions.getRelatedSubPartDocRev);
  const loadRelatedSubPartDocRevAsync = useAsync({
    onSuccess: (data?: { documentRevision: DocumentRevision }) => {
      if (data?.documentRevision) {
        setIsLoading(false);
        setDocumentRevision(data?.documentRevision);
      }
    },
  });

  const loadRelatedSubPartDocRev = () => {
    setIsLoading(true);
    loadRelatedSubPartDocRevAsync.start(
      loadRelatedSubPartDocRevAction, documentRevisionId, loadRelatedSubPartDocRevAsync);
  };

  useEffect(() => {
    loadRelatedSubPartDocRev();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      disableBackdropClick={true}
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      scroll="paper"
      disableEscapeKeyDown={false}
      maxWidth={false}
      open={relatedSubPartDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="related-subpart-dialog"
    >
      <DialogTitle className={classes.dialogTitleText} disableTypography>
        <Typography className={classes.dialogDiv}>
          <Text translation="relatedSubPart.dialog.title" />
        </Typography>
        <div className={classes.dialogDiv}>
          <IconButton
            className={classes.close}
            size="small"
            onClick={handleOpenNewTab}
          >
            <NewTabIcon />
          </IconButton>
          <IconButton
            className={classes.close}
            size="small"
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton></div>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading && <Loader />}
        {!isLoading && documentRevision &&
            <DocumentRevisionSummary {...{ documentRevision, isSideBarHidden: true, canChangeOwnerShip: false }}/> }
      </DialogContent>
    </Dialog>
  );
};

export default RelatedPartsQuickViewDialog;

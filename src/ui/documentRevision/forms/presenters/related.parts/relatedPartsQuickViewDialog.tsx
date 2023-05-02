import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

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
  isOpen: boolean;
  onDialogClose: () => void;
  onNewTabOpen: () => void;
  documentRevisionId: string;
}

const Loader = () => {
  const classes = useStyles();

  return (
    <div
      data-cy="ar-items-loader"
      className={classes.loader}
    >
      <Text translation="common.loading" />
    </div>
  );
};

const RelatedPartsQuickViewDialog: React.FunctionComponent<Props> = ({
  documentId,
  isOpen,
  onDialogClose,
  onNewTabOpen,
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
      open={isOpen}
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
            onClick={onNewTabOpen}
            data-cy="related-subpart-dialog-newtab"
          >
            <NewTabIcon />
          </IconButton>
          <IconButton
            className={classes.close}
            size="small"
            onClick={onDialogClose}
            data-cy="related-subpart-dialog-close"
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

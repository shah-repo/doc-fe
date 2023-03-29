import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { DialogHandler } from "../../../../hooks/useDialog";

import CloseIcon from "@material-ui/icons/Close";
import { ReactComponent as NewTabIcon } from "../../../../../assets/images/new_tab.svg";

import Text from "../../../../components/Text";
import useStyles from "./RelatedPart.styles";

interface Props {
  documentId: string;
  relatedSubPartDialog: DialogHandler;
  closeDialog: (e) => void;
  handleOpenNewTab: () => void;
  documentRevisionId: string;
}

const RelatedPartsQuickViewDialog: React.FunctionComponent<Props> = ({
  documentId,
  relatedSubPartDialog,
  closeDialog,
  handleOpenNewTab,
  documentRevisionId,
}) => {

  const classes = useStyles();
  return (
    <Dialog
      disableBackdropClick={true}
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      scroll="paper"
      disableEscapeKeyDown={true}
      maxWidth={false}
      open={relatedSubPartDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      id="ApprovalRequest-dialog"
    >
      <DialogTitle style={{ display: "flex", justifyContent: "space-between" }} disableTypography>
        <Typography style={{ display: "flex" }}>
          <Text translation="approvalRequest.dialog.title" />
        </Typography>
        <div style={{ display: "flex" }}>
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
      <DialogContent dividers
      >
        <div>nITIN </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedPartsQuickViewDialog;

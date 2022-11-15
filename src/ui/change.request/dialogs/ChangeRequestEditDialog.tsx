/* eslint-disable arrow-body-style */
import { createStyles, Dialog, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";
import React from "react";
import { DialogHandler } from "../../hooks/useDialog";

interface Props {
  changeRequestId: string;
  changeOrderDialog: DialogHandler;
}

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
    },
    dialogContent: {
      overflowY: "unset",
    },
  })
);

const ChangeRequestEditDialog: React.FunctionComponent<Props> = ({
  changeRequestId,
  changeOrderDialog,
}) => {

  const classes = styles();

  return (
    <Dialog
      disableEscapeKeyDown={true}
      disableBackdropClick={true}
      fullWidth={true}
      maxWidth="lg"
      open={changeOrderDialog.isOpen}
      onSubmit={(event: React.FormEvent) => event.stopPropagation()}
      classes={{ paper: classes.dialogContent }}
      id="ChangeOrder-dialog"
    >
      <DialogTitle>
        This is a Dialog - {changeRequestId}
      </DialogTitle>
      <DialogContent
        classes={{ root: classes.dialogContent }}
        id="ChangeOrder-content"
      >
        {/* <ChangeRequestUpdateContainer
          changeRequest={changeRequestDetails as ChangeRequest}></ChangeRequestUpdateContainer> */}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRequestEditDialog;

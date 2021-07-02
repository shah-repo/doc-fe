import { createStyles, Dialog, DialogTitle, makeStyles } from "@material-ui/core";
import React from "react";
import Text from "../../../../../components/Text";
import { DialogHandler } from "../../../../../hooks/useDialog";
import ChangeDocumentFormContent from "./ChangeDocumentFormDialog.content";

interface Props {
  dialog: DialogHandler;
  documentTypeId: string;
}

const styles = makeStyles(() =>
  createStyles({
    dialog: {
      overflowY: "unset",
    },
  },
  ));

const ChangeDocumentFormDialog: React.FunctionComponent<Props> = ({
  dialog,
  documentTypeId,
}) => {
  const classes = styles();

  return (
    <>
      {
        dialog.isOpen &&
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          fullWidth={true}
          maxWidth="xs"
          PaperProps={{ id: "ChangeDocumentFormDialog" }}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>
            <Text translation="common.change.document.form" />
          </DialogTitle>
          <ChangeDocumentFormContent {...{ documentTypeId, dialog }}/>
        </Dialog>
      }
    </>
  ); };

export default ChangeDocumentFormDialog;

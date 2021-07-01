import { Dialog, DialogTitle } from "@material-ui/core";
import React from "react";
import Text from "../../../../../components/Text";
import { DialogHandler } from "../../../../../hooks/useDialog";
import ChangedocumentFormContent from "./ChangeDocumentFormDialog.content";

interface Props {
  dialog: DialogHandler;
}

const ChangeDocumentFormDialog: React.FunctionComponent<Props> = ({
  dialog,
}) => (
  <>
    {
      dialog.isOpen &&
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="md"
          PaperProps={{ id: "ChangeDocumentFormDialog" }}
        >
          <DialogTitle>
            <Text translation="common.change.document.form" />
          </DialogTitle>
          <ChangedocumentFormContent options={[]}/>
        </Dialog>
    }
  </>
);

export default ChangeDocumentFormDialog;

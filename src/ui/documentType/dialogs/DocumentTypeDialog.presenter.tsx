import { Button, CircularProgress, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { styles } from "./FormListDialog/FormListDialog.styles";

export interface DocumentTypeDialogProps extends FormikProps<any> {
  documentTypes: DocumentType[];
  dialog: DialogHandler;
  handleSelection: (id: string) => void;
}
export const DocumentTypeDialog: React.FunctionComponent<DocumentTypeDialogProps> = ({
  dialog,
  documentTypes,
  handleSelection,
}) => {
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string>("");
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const handleSelect = (id: string) => {
    setSelectedDocumentTypeId(id);
    handleSelection(id);
  };
  useEffect(() => {
    setSelectedDocumentTypeId("");
  }, [dialog.isOpen]);
  return (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle>
        <Text translation="supplier.select.type" />
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }} style={{ position: "relative" }}>
        {
          selectedDocumentTypeId &&
          <div
            style={{ position: "absolute", top: "50%", left: "50%", marginTop: -45, marginLeft: -23 }}
          >
            <CircularProgress size={45} />
          </div>
        }
        <AutocompleteField
          name="select-form"
          size="sm"
          autocompleteProps={{ id: "DocTypeListDialog-selectDocType" }}
          options={documentTypes.map((docType) => ({
            label: docType.documentTypeName,
            value: docType.id,
          }))}
          onClick={(option) => handleSelect(option.value)}
          label="supplier.select.type"
        />
        <Button
          variant="text"
          color="secondary"
          className={classes.cancelButton}
          onClick={dialog.close}
          id="DocTypeListDialog-cancelButton"
        >
          <Text translation="transition.action.cancel" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentTypeDialog;

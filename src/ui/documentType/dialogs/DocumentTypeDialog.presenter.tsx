import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DocumentType } from "../../../state/ducks/documentRevisions/documentType";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { styles } from "./FormListDialog/FormListDialog.styles";

export interface DocumentTypeDialogProps {
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
  const handleSelect = (evt) => {
    const id = evt.target.value;
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
        <RadioGroup
          aria-label="selectForm"
          name="select-form"
          onChange={handleSelect}
          value={selectedDocumentTypeId}
          id="FormListDialog-selectForm"
          style={{ visibility: selectedDocumentTypeId ? "hidden" : "visible" }}
        >
          {
            documentTypes.map((type) => (
              <FormControlLabel
                key={type.id}
                value={type.id}
                control={<Radio color="primary" />}
                label={type.documentTypeName}
              />
            ))
          }
        </RadioGroup>
        <Button
          variant="text"
          color="secondary"
          className={classes.cancelButton}
          onClick={dialog.close}
          id="FormListDialog-cancelButton"
        >
          <Text translation="transition.action.cancel" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentTypeDialog;

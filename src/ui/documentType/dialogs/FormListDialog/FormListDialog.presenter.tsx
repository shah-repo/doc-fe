import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DocumentTypeByIdForm } from "../../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../../components/Text";
import { DialogHandler } from "../../../hooks/useDialog";
import { styles } from "./FormListDialog.styles";

export interface FormListDialogProps {
  formIds: DocumentTypeByIdForm[];
  dialog: DialogHandler;
  handleSelection: (id: string) => void;
}
export const FormListDialog: React.FunctionComponent<FormListDialogProps> = ({
  dialog,
  formIds,
  handleSelection,
}) => {
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const handleSelect = (evt) => {
    const id = evt.target.value;
    setSelectedFormId(id);
    handleSelection(id);
  };
  useEffect(() => {
    setSelectedFormId("");
  }, [dialog.isOpen]);
  return (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle>
        <Text translation="supplier.select.form" />
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }} style={{ position: "relative" }}>
        {
          selectedFormId &&
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
          value={selectedFormId}
          id="FormListDialog-selectForm"
          style={{ visibility: selectedFormId ? "hidden" : "visible" }}
        >
          {
            formIds.map((form) => (
              <FormControlLabel
                key={form.id}
                value={form.id}
                control={<Radio color="primary" />}
                label={form.name}
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

export default FormListDialog;

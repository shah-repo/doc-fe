import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";
import Text from "../../components/Text";
import { styles } from "./FormListDialog.styles";

export interface FormListDialogProps {
  formIds: DocumentTypeByIdForm[];
  handleSelection: (e) => void;
  dialog: { isOpen: boolean; close: () => void };
  selectedFormId: string;
  redirectToForm: () => void;
  preventPropagation: (event: React.FormEvent) => void;
}
export const FormListDialog: React.FunctionComponent<FormListDialogProps> = ({
  dialog,
  preventPropagation,
  selectedFormId,
  handleSelection,
  formIds,
  redirectToForm,
}) => {
  const classes = styles();
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
      <DialogContent classes={{ root: classes.dialogContent }}>
        <RadioGroup
          aria-label="selectForm"
          name="select-form"
          onChange={(e) => handleSelection(e)}
          value={selectedFormId}
        >
          {formIds.map((form) => (
            <FormControlLabel
              key={form.id}
              value={form.id}
              control={<Radio color="primary" />}
              label={form.name}
            />
          ))}
        </RadioGroup>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.submitButton}
          onClick={redirectToForm}
          disabled={isEmpty(selectedFormId)}
        >
          <Text translation="common.open" />
        </Button>
        <Button
          variant="text"
          color="secondary"
          className={classes.cancelButton}
          onClick={dialog.close}
        >
          <Text translation="transition.action.cancel" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FormListDialog;

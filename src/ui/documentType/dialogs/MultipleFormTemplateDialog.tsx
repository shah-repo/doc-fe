import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import { FormikProps } from "formik";
import React from "react";
import { DocumentType, DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { styles } from "./FormListDialog/FormListDialog.styles";

export interface DocumentTypeDialogProps extends FormikProps<any> {
  documentTypes: DocumentType[];
  formIds: DocumentTypeByIdForm[];
  dialog: DialogHandler;
  handleSelection: (id: string) => void;
  handleTemplateSelection: (id: string) => void;
}
export const MultipleFormTemplateDialog: React.FunctionComponent<DocumentTypeDialogProps> = ({
  dialog,
  formIds,
  documentTypes,
  handleSelection,
  handleTemplateSelection,
}) => {
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const handleSelect = (id: string) => {
    handleSelection(id);
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle>
        <Grid container className={classes.containerWrap}>
          <Grid item xs={2} className={classes.gridWrap}>
            <span className={classes.iconContainer}>
              <PostAddTwoToneIcon className={classes.icon}/>
            </span>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h6">
              <Text translation="record.select.type" />
            </Typography>
            <Typography variant="h5">
              <Text translation="react.select.create.title" />
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }} style={{ position: "relative" }}>
        <AutocompleteField
          name="select-form"
          size="sm"
          autocompleteProps={{ id: "MultipleFormTemplate-selectDocForm" }}
          options={documentTypes.map((docType) => ({
            label: docType.documentTypeName,
            value: docType.id,
          }))}
          onClick={(option) => handleSelect(option.value)}
          label="record.select.type"
        />
        {formIds.length > 1 && <AutocompleteField
          name="select-template-form"
          size="sm"
          autocompleteProps={{ id: "MultipleFormTemplate-selectDocType" }}
          options={formIds.map((form) => ({
            label: form.name,
            value: form.id,
          }))}
          onClick={(option) => handleTemplateSelection(option.value)}
          label="record.select.template"
        />}
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

export default MultipleFormTemplateDialog;

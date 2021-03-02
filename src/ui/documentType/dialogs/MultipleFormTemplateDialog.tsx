import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import { FormikProps } from "formik";
import React from "react";
import { DocumentType, DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import FormProgress from "../../components/forms/FormProgress";
import FormWrapper from "../../components/forms/FormWrapper";
import Text from "../../components/Text";
import { DialogHandler } from "../../hooks/useDialog";
import { docIdAsyncContext } from "../list/CreateDocumentByType";
import { styles } from "./FormListDialog/FormListDialog.styles";

interface DocumentTypeDialogProps extends FormikProps<any> {
  documentTypes: DocumentType[];
  formIds: DocumentTypeByIdForm[];
  dialog: DialogHandler;
  handleSelection: (id: string) => void;
  handleTemplateSelection: (id: string) => void;
  isRecord: boolean;
  closeMultipleFormDialog: () => void;
}
const MultipleFormTemplateDialog: React.FunctionComponent<DocumentTypeDialogProps> = ({
  dialog,
  formIds,
  documentTypes,
  handleSelection,
  handleTemplateSelection,
  initialValues,
  dirty,
  resetForm,
  isRecord,
  closeMultipleFormDialog,
}) => {
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const handleSelect = (id: string) => {
    handleSelection(id);
  };
  const docIdAsyncState = React.useContext(docIdAsyncContext);
  return (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={closeMultipleFormDialog}
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
              <Text translation={isRecord ? "record.select.type" : "supplier.select.type" } />
            </Typography>
            <Typography variant="h5">
              <Text translation={isRecord ? "record.select.create.title" : "document.select.create.title"}/>
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }} style={{ position: "relative" }}>
        <FormWrapper
          dirty={dirty}
          initialValues={initialValues}
          resetForm={resetForm}
        >
          <FormProgress asyncState={docIdAsyncState} />
          <AutocompleteField
            name="selectType"
            size="sm"
            autocompleteProps={{ id: "MultipleFormTemplate-selectDocForm" }}
            options={documentTypes.map((docType) => ({
              label: docType.documentTypeName,
              value: docType.id,
            }))}
            onClick={(option) => handleSelect(option.value)}
            label={isRecord ? "record.select.type" : "supplier.select.type" }
            data-cy={isRecord ? "record.select.type" : "supplier.select.type" }
          />
          {formIds.length > 1 && <AutocompleteField
            name="selectForm"
            size="sm"
            autocompleteProps={{ id: "MultipleFormTemplate-selectDocType" }}
            options={formIds.map((form) => ({
              label: form.name,
              value: form.id,
            }))}
            onClick={(option) => handleTemplateSelection(option.value)}
            label={isRecord ? "record.select.template" : "supplier.select.form"}
            data-cy={isRecord ? "record.select.template" : "supplier.select.form"}
          />}
          <Button
            variant="text"
            color="secondary"
            className={classes.cancelButton}
            onClick={closeMultipleFormDialog}
            id="DocTypeListDialog-cancelButton"
            data-cy="suggestFormCancelBtn"
          >
            <Text translation="transition.action.cancel" />
          </Button>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleFormTemplateDialog;

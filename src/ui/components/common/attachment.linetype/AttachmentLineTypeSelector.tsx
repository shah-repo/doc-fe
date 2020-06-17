import { Button, createStyles, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { FieldInputProps, Formik, FormikProps } from "formik";
import React from "react";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { FormContext, useFormContext } from "../../forms/FormContext";
import AttachmentLineTypeForm from "./AttachmentLineTypeForm";


interface Props {
  upload: typeof attachmentsActions.upload;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  multiple?: boolean;
  name?: string;
  disabled?: boolean;
}

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
    },
    dialogContent: {
      overflowY: "unset",
      maxWidth: 400,
    },
  },
  ));


export const AttachmentLineTypeSelector: React.FunctionComponent<Props> = ({
  upload,
  multiple,
  field,
  form,
  name,
  disabled,
}) => {
  const { submitForm } = useFormContext();
  const classes = styles();
  const dialog = useDialog();
  const async = useAsync<any>({ onSuccess: dialog.close });


  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const closeDialog = () => {
    submitForm();
    dialog.close();
  };

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = () => (
    <AttachmentLineTypeForm
      {...{ field, upload, form, name, multiple, disabled }}
      onCancel= {closeDialog}
    />
  );

  return (
    <>
      <Button
        color="primary"
        startIcon={<AttachFileIcon />}
        onClick={openDialog}
        id="ApproveAndRelease-button"
      >
        Upload Files
      </Button>
      {
        dialog.isOpen &&
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          maxWidth="xs"
          open={dialog.isOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
          id="ApproveAndRelease-dialog"
        >
          <DialogContent
            classes={{ root: classes.dialogContent }}
            id="ApproveAndRelease-content"
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={{ }}
                onSubmit={(values: any) => values}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      }
    </>
  );
};

export default AttachmentLineTypeSelector;

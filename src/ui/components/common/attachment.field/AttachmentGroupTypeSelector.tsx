import { Button, createStyles, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { FormContext } from "../../forms/FormContext";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { ApproveAndReleaseFormValues } from "./types";
import AttachmentGroupTypeForm  from "./AttachmentGroupTypeForm";
import AttachFileIcon from "@material-ui/icons/AttachFile";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  text: string;
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

// eslint-disable-next-line no-empty-pattern
export const AttachmentGroupTypeSelector: React.FunctionComponent<Props> = ({
  text,
}) => {
  const classes = styles();
  const dialog = useDialog();
  const async = useAsync<any>({ onSuccess: dialog.close });


  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const closeDialog = () => {
    dialog.close();
  };


  const onSubmit = (values: any) => {
    // eslint-disable-next-line no-console
    console.log("submitted");
  };


  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const renderForm = (props: FormikProps<ApproveAndReleaseFormValues>) => (
    <AttachmentGroupTypeForm onCancel= {closeDialog} />
  );

  return (
    <>
      <Button
        color="secondary"
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
                initialValues={{ password: "", approvals: [] }}
                onSubmit={onSubmit}
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

export default AttachmentGroupTypeSelector;

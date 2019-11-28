import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Formik, FormikHelpers as FormikActions, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../../state/types";
import FileCard from "../../../components/cards/FileCard";
import Text from "../../../components/Text";
import { Attachment, FileUploadFormValues } from "../types";
import styles from "./Attachments.styles";
import FileUploadForm from "./FileUploadForm";

interface Props extends WithStyles<typeof styles> {
  removeAttachment: (index: number) => () => void;
  attachments: Attachment[];
  onSubmit: (values: FileUploadFormValues, actions: FormikActions<FileUploadFormValues>) => void;
  closeDialog: () => void;
  openDialog: () => void;
  isDialogOpen: boolean;
  uploadAsyncStatus: AsyncState;
}

const AttachmentsPresenter: React.FunctionComponent<Props> =
  ({ classes, removeAttachment, attachments, onSubmit, closeDialog, openDialog, isDialogOpen, uploadAsyncStatus }) => {

    const Files = (attachments || []).map((attachment: Attachment, index: number) => (
      <FileCard key={index} attachment={attachment} removeAttachment={removeAttachment(index)} />
    ));

    const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

    const renderForm = (props: FormikProps<any>) => (
      <FileUploadForm {...props} asyncState={uploadAsyncStatus} cancel={closeDialog} />
    );

    return (
      <div className={classes.container}>
        <div className={classes.title}>
          <Typography variant="subtitle1">
            <Text translation="common.attachments" />:
          </Typography>
          <Fab size="small" color="secondary" aria-label="Create" onClick={openDialog}>
            <Add fontSize="small" />
          </Fab>
        </div>
        <Grid container={true} spacing={8} className={classes.content}>
          {Files}
        </Grid>
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={isDialogOpen}
          onSubmit={preventPropagation}
        >
          <DialogTitle>
            <Text translation="document.file.title" />
          </DialogTitle>
          <DialogContent>
            <Formik
              render={renderForm}
              initialValues={{}}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default withStyles(styles)(AttachmentsPresenter);

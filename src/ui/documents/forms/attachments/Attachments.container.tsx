import { FieldArrayRenderProps, FormikActions, FormikProps } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import { attachmentsActions, attachmentsSelectors } from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import { AsyncState } from "../../../../state/types";
import useCallbackHandler from "../../../hooks/useCallbackHandler";
import { Attachment, DocumentFormValues, FileUploadFormValues } from "../types";
import AttachmentsPresenter from "./Attachments.presenter";

interface OwnProps extends FieldArrayRenderProps {
  form: FormikProps<DocumentFormValues>;
}

interface StateProps {
  uploadAsyncStatus: AsyncState;
}

interface DispatchProps {
  upload: typeof attachmentsActions.upload;
  resetUploadAsyncState: typeof attachmentsActions.resetUploadAsyncState;
}

type Props = OwnProps & DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  uploadAsyncStatus: attachmentsSelectors.attachmentUploadAsyncStatus(state),
});

const Attachments: React.FunctionComponent<Props> = ({
  form, remove, push, upload, uploadAsyncStatus, resetUploadAsyncState,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    resetUploadAsyncState();
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  const attachmentUploaded = (attachment: Attachment) => {
    push(attachment);
    closeDialog();
  };
  const uploadHandler = useCallbackHandler<Attachment>(attachmentUploaded);

  const removeAttachment = (index: number) => () => remove(index);

  const onSubmit = (values: FileUploadFormValues, actions: FormikActions<FileUploadFormValues>) => {
    upload(values.file as File, uploadHandler);
    actions.setSubmitting(false);
  };

  return (
    <AttachmentsPresenter
      attachments={form.values.attachments}
      removeAttachment={removeAttachment}
      isDialogOpen={isDialogOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
      onSubmit={onSubmit}
      uploadAsyncStatus={uploadAsyncStatus}
    />
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  upload: attachmentsActions.upload,
  resetUploadAsyncState: attachmentsActions.resetUploadAsyncState,
})(Attachments);

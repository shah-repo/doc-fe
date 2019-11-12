import { FieldArrayRenderProps, FormikProps } from "formik";
import React from "react";
import { connect } from "react-redux";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { ImplementationPlan } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import {
  Attachment,
  ChangeRequestFormValues,
  FileUploadFormValues,
  Justifications,
} from "../types";
import AttachmentsPresenter from "./Attachments.presenter";

interface AttachmentsKey {
  [attachmentsKey: string]: ImplementationPlan | Justifications;
}

interface OwnProps extends FieldArrayRenderProps {
  form: FormikProps<ChangeRequestFormValues & AttachmentsKey>;
  attachmentsKey: string;
}

interface DispatchProps {
  upload: typeof attachmentsActions.upload;
}

type Props = OwnProps & DispatchProps;

const Attachments: React.FunctionComponent<Props> = ({ form, remove, push, upload, attachmentsKey }) => {
  const dialog = useDialog();
  const async = useAsync<Attachment>({
    onSuccess: (attachment?: Attachment) => {
      push(attachment);
      dialog.close();
    },
  });

  const openDialog = () => {
    async.reset();
    dialog.open();
  };

  const removeAttachment = (index: number) => () => remove(index);

  const onSubmit = (values: FileUploadFormValues) => {
    async.start(upload, values.file as File, async);
  };

  return (
    <AttachmentsPresenter
      attachments={form.values[attachmentsKey].attachments}
      removeAttachment={removeAttachment}
      isDialogOpen={dialog.isOpen}
      openDialog={openDialog}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
      uploadAsyncStatus={async.asyncState}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(Attachments);

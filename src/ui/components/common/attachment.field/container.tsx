import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import {
  Attachment,
  Attachment as AttachmentModel,
  attachmentsActions,
} from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import useAsync from "../../../hooks/useAsync";
import FormProgress from "../../forms/FormProgress";
import { withFormik } from "../../hoc/formik";
import Presenter from "./presenter";
import { AttachmentContainerProps, AttachmentFieldDispatchProps } from "./utils/types";
import FormMessage from "../../forms/FormMessage";

type DispatchProps = AttachmentFieldDispatchProps;

export const AttachmentFieldContainer: React.FunctionComponent<AttachmentContainerProps> = ({
  name,
  upload,
  component = "button",
  multiple = true,
  field,
  form,
  ...other
}) => {

  const handleUpload = (files: File[]) => {
    if (files.length === 0) { return; }

    const file = files.pop();
    if (!file) { return; }

    async.start(upload, file, async);
    handleUpload(files);
  };

  const async = useAsync<AttachmentModel>({
    onSuccess: (attachment?: AttachmentModel) => {
      if (!attachment && !form && !field) { return; }
      if (!multiple) {
        return form!.setFieldValue(name, attachment);
      }
      const attachments: Attachment[] = field!.value || [];
      attachments.push(attachment!);
      form!.setFieldValue(name, attachments);
    },
  });
  
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) { return; }
    handleUpload(Array.from(event.currentTarget.files) as File[]);
  };

  return (
    <Box>
      <FormProgress asyncState={async.asyncState} />
      <FormMessage asyncState={async.asyncState} />
      <Presenter {...other} name={name} component={component} multiple={multiple} onChange={onChange} />
    </Box>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(withFormik(AttachmentFieldContainer));

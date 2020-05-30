import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Attachment, Attachment as AttachmentModel, attachmentsActions } from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useAsync from "../../../hooks/useAsync";
import { useFormContext } from "../../forms/FormContext";
import FormMessage from "../../forms/FormMessage";
import FormProgress from "../../forms/FormProgress";
import { withFormik } from "../../hoc/formik";
import Presenter from "./presenter";
import { AttachmentContainerProps, AttachmentFieldDispatchProps } from "./utils/types";

type DispatchProps = AttachmentFieldDispatchProps;

export const AttachmentFieldContainer: React.FunctionComponent<AttachmentContainerProps> = ({
  name = "",
  upload,
  component = "button",
  multiple = true,
  field,
  form,
  ...other
}) => {
  const { submitForm } = useFormContext();
  const handleUpload = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    async.start(upload, file, async);
    handleUpload(files);
  };

  const async = useAsync<AttachmentModel>({
    onSuccess: (attachment?: AttachmentModel) => {
      if (!attachment && !form && !field) {
        return;
      }
      if (!multiple) {
        return form.setFieldValue(name, attachment);
      }
      const attachments: Attachment[] = field.value ? [...field.value] : [];
      attachment && attachments.push(attachment);

      FBStore.setValues({
        ...FBStore.values,
        [name]: _.map(attachments, (attach) =>
          _.pick(attach, ["id", "name", "s3link", "type"]),
        ),
      });

      if (FBStore.mode === "form") {
        FBStore.setValues({
          ...FBStore.values,
          [name]: _.map(attachments, (attach) =>
            _.pick(attach, ["id", "name", "s3link", "type"]),
          ),
        });
        FBDynamicValidatorStore.validate();
      }
      form.setFieldValue(name, attachments);
      submitForm();
    },
  });

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    let isUserAlerted = false;
    const filteredFiles = Array.from(event.currentTarget.files || []).filter(
      (file) => {
        const type = file.name.split(".").pop();

        if (type === "doc") {
          // TODO: update react-intl and make use of hooks to translate this message
          !isUserAlerted &&
            alert(".doc files are not accepted. Please use .docx");
          isUserAlerted = true;
          return false;
        }
        return true;
      },
    );


    if (filteredFiles.length === 0) {
      return;
    }

    handleUpload(filteredFiles);
  };

  return (
    <Box>
      <FormProgress asyncState={async.asyncState} />
      <FormMessage asyncState={async.asyncState} />
      <Presenter
        {...other}
        name={name}
        component={component}
        multiple={multiple}
        onChange={onChange}
        form={form}
        field={field}
      />
    </Box>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(withFormik(AttachmentFieldContainer));

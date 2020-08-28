import { Box, CircularProgress } from "@material-ui/core";
import { map, pick } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { Attachment, attachmentsActions } from "../../../../state/ducks/attachments";
import { ApplicationState } from "../../../../state/reducers";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useAsync from "../../../hooks/useAsync";
import { useFormContext } from "../../forms/FormContext";
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const intl = useIntl();

  const async = useAsync<Attachment>({
    onSuccess: (attachment?: Attachment) => {
      setIsUploading(false);
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
        [name]: map(attachments, (attach) =>
          pick(attach, ["id", "name", "s3link", "type"]),
        ),
      });

      if (FBStore.mode === "form") {
        FBStore.setValues({
          ...FBStore.values,
          [name]: map(attachments, (attach) =>
            pick(attach, ["id", "name", "s3link", "type"]),
          ),
        });
        FBDynamicValidatorStore.validate();
      }
      form.setFieldValue(name, attachments);
      submitForm();
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  const handleUpload = (files: File[], lineType, cleanCopRequired) => {
    if (files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }
    setIsUploading(true);
    async.start(upload, file, lineType, async, cleanCopRequired);
    handleUpload(files, lineType, cleanCopRequired);
  };

  const onChange = (lineType: string, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => {
    let isUserAlertedNoDocFiles = false;
    let isUserAlrtedCleanCopyMismatch = false;
    const filteredFiles = Array.from(event.currentTarget.files || []).filter(
      (file) => {
        const type = file.name.split(".").pop();
        if (type === "doc") {
          !isUserAlertedNoDocFiles &&
           alert(intl.formatMessage({ id: "common.attachment.form.DOCERROR" }));
          isUserAlertedNoDocFiles = true;
          return false;
        }

        if (type !== "docx" && cleanCopyRequired) {
          !isUserAlrtedCleanCopyMismatch &&
          alert(intl.formatMessage({ id: "common.attachment.form.Create.Clean.Copy.Error" }));
          isUserAlrtedCleanCopyMismatch = true;
          return false;
        }
        return true;
      },
    );

    if (filteredFiles.length === 0) {
      return;
    }

    handleUpload(filteredFiles, lineType, cleanCopyRequired);
  };

  return (
    <>
      {isUploading &&
      <Box>
        <CircularProgress color="secondary" />
      </Box>}

      {!isUploading &&
      <Box>
        <Presenter
          {
            ...{
              name,
              isUploading,
              upload,
              component,
              multiple,
              form,
              field,
              onChange,
            }
          }
          {...other}
        />
      </Box>
      }
    </>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(withFormik(AttachmentFieldContainer));

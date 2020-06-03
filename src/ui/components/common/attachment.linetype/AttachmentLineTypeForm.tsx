import { Box, IconButton, Link } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import _ from "lodash";
import * as React from "react";
import { Attachment, Attachment as AttachmentModel, attachmentsActions } from "../../../../state/ducks/attachments";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useAsync from "../../../hooks/useAsync";
import { useFormContext } from "../../forms/FormContext";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { FieldInputProps, FormikProps } from "formik";
import { useIntl } from "react-intl";

interface Props {
  onCancel: () => void;
  upload: typeof attachmentsActions.upload;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  multiple?: boolean;
  name?: string;
  disabled?: boolean;
}

const AttachmentLineTypeForm: React.FunctionComponent<Props> = ({
  onCancel,
  upload,
  field,
  form,
  multiple,
  name,
  disabled,
}) => {
  const isField = true;
  const classes = styles({ isField });
  const intl = useIntl();
  const { submitForm } = useFormContext();

  const async = useAsync<AttachmentModel>({
    onSuccess: (attachment?: AttachmentModel) => {
      name = name ? name : "";
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
      onCancel();
    },
  });

  const handleUpload = (files: File[], isRedLine) => {
    if (files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    async.start(upload, file, isRedLine, async);
    handleUpload(files, isRedLine);
  };

  const onChange = (lineType) => (event: React.FormEvent<HTMLInputElement>) => {
    let isUserAlerted = false;
    const filteredFiles = Array.from(event.currentTarget.files || []).filter(
      (file) => {
        const type = file.name.split(".").pop();

        if (type === "doc") {
          !isUserAlerted &&
           alert(intl.formatMessage({ id: "document.revision.download.html.error" }));
          isUserAlerted = true;
          return false;
        }
        return true;
      },
    );


    if (filteredFiles.length === 0) {
      return;
    }

    handleUpload(filteredFiles, lineType);
  };


  return (
    <Box className={classes.Box}>
      <IconButton
        className={classes.closeRoot}
        onClick={onCancel}
        id="AttachmentIconPresenter-handleRemove"
      >
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      <PublishRoundedIcon fontSize="large"/>
      <h2 className={classes.h4}>Upload a file</h2>
      <Text message="Select action for the uploading file"/>
      <Box style={{ paddingTop: 20 }}>
        <input
          accept="*"
          id={`${name}-button-file-clean-copy`}
          multiple={multiple}
          type="file"
          onChange={onChange(LINE_TYPES.CLEAN_COPY)}
          className = {classes.input}
          disabled={disabled}
        />
        <label htmlFor={`${name}-button-file-clean-copy`} >
          <Link component="span" variant="button" className={classes.link} id="AttachmentFieldPresenter-linkButton" >
            <FormatAlignLeftIcon className={classes.iconCleanCopy} />
            <Text message="Upload a clean copy" />
          </Link>
        </label>
      </Box>
      <Box>
        <input
          accept="*"
          id={`${name}-button-file-red-line`}
          multiple={multiple}
          type="file"
          onChange={onChange(LINE_TYPES.RED_LINE)}
          className = {classes.input}
          disabled={disabled}
        />
        <label htmlFor={`${name}-button-file-red-line`}>
          <Link component="span" variant="button" className={classes.link} id="AttachmentFieldPresenter-linkButton" >
            <FormatAlignLeftIcon className={classes.iconRedline} />
            <Text message="Upload a redline" />
          </Link>
        </label>
      </Box>

    </Box>
  );
};

export default AttachmentLineTypeForm;

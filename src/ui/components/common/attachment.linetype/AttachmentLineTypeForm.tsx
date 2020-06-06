import { Box, IconButton, Link, CircularProgress } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import NotesIcon from "@material-ui/icons/Notes";
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
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { useState } from "react";

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
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
      setIsUploading(false);
      onCancel();
    },
  });

  const handleUpload = (files: File[], isRedLine, cleanCopRequired) => {
    setIsUploading(true);
    if (files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    async.start(upload, file, isRedLine, async, cleanCopRequired);
    handleUpload(files, isRedLine, cleanCopRequired);
  };

  const onChange = (lineType, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => {
    let isUserAlerted = false;
    const filteredFiles = Array.from(event.currentTarget.files || []).filter(
      (file) => {
        const type = file.name.split(".").pop();
        if (type === "doc") {
          !isUserAlerted &&
           alert(intl.formatMessage({ id: "common.attachment.form.DOCERROR" }));
          isUserAlerted = true;
          return false;
        }

        if (type !== "docx" && cleanCopyRequired) {
          !isUserAlerted &&
          alert(intl.formatMessage({ id: "common.attachment.form.Create.Clean.Copy.Error" }));
          isUserAlerted = true;
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
      {!isUploading &&
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
          id={`${name}-button-file-create-clean-copy`}
          multiple={multiple}
          type="file"
          onChange={onChange(LINE_TYPES.RED_LINE, true)}
          className = {classes.input}
          disabled={disabled}
        />
        <label htmlFor={`${name}-button-file-create-clean-copy`} >
          <Link component="span" variant="button" className={classes.link} id="AttachmentFieldPresenter-linkButton" >
            <PlaylistAddIcon className={classes.iconCleanCopy} />
            <Text message="Create a clean copy" />
          </Link>
        </label>
      </Box>
      <Box >
        <input
          accept="*"
          id={`${name}-button-file-clean-copy`}
          multiple={multiple}
          type="file"
          onChange={onChange(LINE_TYPES.CLEAN_COPY, false)}
          className = {classes.input}
          disabled={disabled}
        />
        <label htmlFor={`${name}-button-file-clean-copy`} >
          <Link component="span" variant="button" className={classes.link} id="AttachmentFieldPresenter-linkButton" >
            <NotesIcon className={classes.iconCleanCopy} />
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
          onChange={onChange(LINE_TYPES.RED_LINE, false)}
          className = {classes.input}
          disabled={disabled}
        />
        <label htmlFor={`${name}-button-file-red-line`}>
          <Link component="span" variant="button" className={classes.link} id="AttachmentFieldPresenter-linkButton" >
            <NotesIcon className={classes.iconRedline} />
            <Text message="Upload a redline" />
          </Link>
        </label>
      </Box>

    </Box>
      }

      {isUploading &&
       <Box className={classes.Box}>
         <CircularProgress color="secondary" />
       </Box>}
    </>
  );
};

export default AttachmentLineTypeForm;

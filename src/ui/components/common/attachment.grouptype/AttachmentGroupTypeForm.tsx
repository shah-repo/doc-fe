import { Box, IconButton, Link } from "@material-ui/core";
import * as React from "react";
import Text from "../../Text";
import { styles } from "./utils/styles";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import CloseIcon from "@material-ui/icons/Close";
import {  Attachment, Attachment as AttachmentModel, attachmentsActions  } from "../../../../state/ducks/attachments";
import useAsync from "../../../hooks/useAsync";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import { useFormContext } from "../../forms/FormContext";
import _ from "lodash";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  onCancel: any;
  upload: typeof attachmentsActions.upload;
  field: any;
  form: any;
  multiple: any;
  name: any;
  disabled: any;
}

// eslint-disable-next-line no-empty-pattern
const AttachmentGroupTypeForm: React.FunctionComponent<Props> = ({
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
  const { submitForm } = useFormContext();

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
      onCancel();
    },
  });

  const handleUpload = (files: File[], isRedline) => {
    if (files.length === 0) {
      return;
    }

    const file = files.pop();
    if (!file) {
      return;
    }

    async.start(upload, file, async);
    handleUpload(files, isRedline);
  };

  const onChangeCleanCopy = (isRedline) => (event: React.FormEvent<HTMLInputElement>) => {
    let isUserAlerted = false;
    // eslint-disable-next-line no-console
    console.log(isRedline);
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

    handleUpload(filteredFiles, isRedline);
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
          onChange={onChangeCleanCopy(true)}
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
          onChange={onChangeCleanCopy(false)}
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

export default AttachmentGroupTypeForm;

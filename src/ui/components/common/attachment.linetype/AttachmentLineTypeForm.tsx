import { Box, CircularProgress, IconButton, Link } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import NotesIcon from "@material-ui/icons/Notes";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import * as React from "react";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import Text from "../../Text";
import { styles } from "./utils/styles";

interface Props {
  onCancel: () => void;
  onChange: (lineType: string, cleanCopyRequired: boolean) => (event: React.FormEvent<HTMLInputElement>) => any;
  isUploading: boolean;
  multiple?: boolean;
  name?: string;
  disabled?: boolean;
}

const AttachmentLineTypeForm: React.FunctionComponent<Props> = ({
  onCancel,
  onChange,
  multiple = true,
  name = "",
  disabled,
  isUploading,
}) => {
  const isField = true;
  const classes = styles({ isField });

  return (
    <>
      {!isUploading &&
    <Box className={classes.Box}>
      <IconButton
        className={classes.closeRoot}
        onClick={onCancel}
        id="AttachmentFieldPresenter-handleRemove"
      >
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
      <PublishRoundedIcon fontSize="large"/>
      <h2 className={classes.h4}>Upload a file</h2>
      <Text translation="common.attachment.redline.form.prompt"/>
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
          <Link component="span"
            variant="button"
            className={classes.link}
            id="AttachmentFieldPresenter-linkButton-create-clean-copy" >
            <PlaylistAddIcon className={classes.iconCleanCopy} />
            <Text translation="common.attachment.upload.button.createCleanCopy" />
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
          <Link component="span"
            variant="button"
            className={classes.link}
            id="AttachmentFieldPresenter-linkButton-clean-copy" >
            <NotesIcon className={classes.iconCleanCopy} />
            <Text translation="common.attachment.upload.button.cleanCopy" />
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
          <Link component="span" variant="button"
            className={classes.link}
            id="AttachmentFieldPresenter-linkButton-red-line">
            <NotesIcon className={classes.iconRedline} />
            <Text translation="common.attachment.upload.button.redline" />
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

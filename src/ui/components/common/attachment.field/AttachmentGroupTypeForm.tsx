import { Button, Box, IconButton } from "@material-ui/core";
import * as React from "react";
import Text from "../../Text";
import { styles } from "./AttachmentGroupType.styles";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import CloseIcon from '@material-ui/icons/Close';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  onCancel: any;
}

// eslint-disable-next-line no-empty-pattern
const AttachmentGroupTypeForm: React.FunctionComponent<Props> = ({
  onCancel,
}) => {
  const classes = styles();

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
      <Button
        onClick={onCancel}
        color="secondary"
        id="ApproveAndRelease-cancelButton"
        size="large"
        startIcon={<PostAddOutlinedIcon fontSize="large" />}
      >
        <Text message="Create a clean copy"/>
      </Button>
      <Button
        onClick={onCancel}
        color="secondary"
        id="ApproveAndRelease-cancelButton"
        size="large"
        startIcon={<DescriptionOutlinedIcon fontSize="large" />}
      >
        <Text message="Upload a clean copy"/>
      </Button>
      <Button
        onClick={onCancel}
        color="secondary"
        id="ApproveAndRelease-cancelButton"
        size="large"
        startIcon={<DescriptionOutlinedIcon fontSize="large" />}
      >
        <Text message="Upload a redline copy" />
      </Button>
    </Box>
  );
};

export default AttachmentGroupTypeForm;

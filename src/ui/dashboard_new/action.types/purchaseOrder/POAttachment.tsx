import { Box, CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import React from "react";
import { Attachment } from "../../../change.request/form/types";

interface Props {
  attachment: Attachment;
  download: () => void;
}

const styles = makeStyles((theme) =>
  createStyles({
    link: {
      "color": theme.palette.primary.main,
      "marginRight": 15,
      "cursor": "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  }));

const POAttachment: React.FunctionComponent<Props> = ({
  attachment,
  download,
}) => {
  const classes = styles();
  const renderProgress = attachment.isLoading &&
    <Box component="span">
      <CircularProgress size={10} />
    </Box>;

  return (
    <Box component="span" className={classes.link} onClick={download}>
      <Box component="span">
        {renderProgress}
        {!attachment.isLoading && <AttachFileIcon fontSize="inherit" />}
        {`${attachment.name}.${attachment.type}`}
      </Box>
    </Box>
  );
};

export default POAttachment;

import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import React from "react";
import FileIcon from "./icon";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIconPresenter: React.FunctionComponent<AttachmentIconProps> = ({
  attachments,
  size,
  handleRemove,
  handleDownload,
  ...other
}) => {

  const classes = styles({ size: size || "md" });

  const attachmentsRenderer = (attachments || []).map((attachment) => {
    return (
      <Grid key={`cell-${attachment.id}`} item={true} xs={3}>
        <Box className={classes.closeRoot}>
          <IconButton className={classes.closeRoot} onClick={handleRemove && handleRemove(attachment)}>
            <CancelOutlined className={classes.closeIcon} />
          </IconButton>
        </Box>
        <IconButton style={{ fontSize: "initial" }} onClick={handleDownload && handleDownload(attachment.id)}>
          <FileIcon key={`icon-${attachment.id}`} {...other} extension={attachment.type} />
        </IconButton>
        <Typography variant="caption" gutterBottom={true} align="justify" className={classes.fileName} noWrap>
          {`${attachment.name}.${attachment.type}`}
        </Typography>
      </Grid>
    );
  });

  return <Grid container={true} >{attachments && attachmentsRenderer}</Grid>;
};

export default AttachmentIconPresenter;

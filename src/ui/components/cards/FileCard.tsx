import { Card, CardActions, CardContent, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments/types";
import DownloadButtonContainer from "./DownloadButton.container";

export interface FileCardProps {
  removeAttachment?: () => void;
  attachment: Attachment;
}

const FileCard: React.FunctionComponent<FileCardProps> = ({ removeAttachment, attachment }) => {
  const removeButton = removeAttachment && (
    <IconButton id="delete" aria-label="Delete" onClick={removeAttachment}>
      <Delete fontSize="small" />
    </IconButton>
  );

  return (
    <Grid item={true} xs={12} md={6} lg={3}>
      <Tooltip id="tooltip-attachmentName" title={`${attachment.name}.${attachment.type}`}>
        <Card>
          <CardContent>
            <Typography id="name" variant="h5" component="h2" noWrap={true}>
              {attachment.name}
            </Typography>
            <Typography id="type" color="textSecondary">
              {attachment.type}
            </Typography>
          </CardContent>
          <CardActions>
            {removeButton}
            <DownloadButtonContainer attachment={attachment} />
          </CardActions>
        </Card>
      </Tooltip>
    </Grid>
  );
};

export default FileCard;

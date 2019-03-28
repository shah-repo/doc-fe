import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { CloudDownload, Delete } from "@material-ui/icons";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";

interface FileCardProps {
  removeAttachment?: () => void;
  attachment: Attachment;
}

const FileCard: React.FunctionComponent<FileCardProps> = ({ removeAttachment, attachment }) => {
  const removeButton = removeAttachment && (
    <IconButton aria-label="Delete" onClick={removeAttachment}>
      <Delete fontSize="small" />
    </IconButton>
  );

  const downloadButton = (
    <IconButton aria-label="Download" disabled={true}>
      <CloudDownload fontSize="small" />
    </IconButton>
  );

  return (
    <Grid item={true} xs={12} md={6} lg={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" noWrap={true}>
            {attachment.name}
          </Typography>
          <Typography color="textSecondary">
            {attachment.type}
          </Typography>
        </CardContent>
        <CardActions>
          {removeButton}
          {downloadButton}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default FileCard;

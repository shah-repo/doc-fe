import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Attachment } from "../../state/ducks/attachments";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import FileCard from "../components/cards/FileCard";
import Text from "../components/Text";
import styles from "./DocumentRevisionPreview.styles";
import { documentRevisionIdMask } from "./helpers";

interface DocumentRevisionPreviewPresenterProps extends WithStyles<typeof styles> {
  documentRevision: DocumentRevision | null;
}

const DocumentRevisionPreviewPresenter: React.FunctionComponent<DocumentRevisionPreviewPresenterProps> =
  ({ classes, documentRevision }) => {
    if (!documentRevision) { return null; }

    const attachments = (documentRevision.attachments || []).map((attachment: Attachment, index: number) => (
      <FileCard key={index} attachment={attachment} />
    ));

    return (
      <Grid container={true} className={classes.container} spacing={8}>
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="common.documentId" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h6">
            {documentRevisionIdMask(documentRevision.type, documentRevision.document.typeCount)}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="common.state" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h6">
            {documentRevision.status}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="common.type" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h6">
            {documentRevision.type}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="common.description" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h6">
            {documentRevision.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="common.name" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h6">
            {documentRevision.name}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Grid container={true} spacing={8}>
            {attachments}
          </Grid>
        </Grid>
      </Grid>
    );
  };

export default withStyles(styles)(DocumentRevisionPreviewPresenter);

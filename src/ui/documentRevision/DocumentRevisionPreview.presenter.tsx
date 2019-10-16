import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Attachment } from "../../state/ducks/attachments";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import FileCard from "../components/cards/FileCard";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import styles from "./DocumentRevisionPreview.styles";
import PreviewControlsContainer from "./PreviewControls.container";

export interface DocumentRevisionPreviewPresenterProps
  extends WithStyles<typeof styles> {
  documentRevision: DocumentRevision | null;
}

// TODO: check if this can be deleted
export const DocumentRevisionPreviewPresenter: React.FunctionComponent<
  DocumentRevisionPreviewPresenterProps
> = ({ classes, documentRevision }) => {
  if (!documentRevision) {
    return null;
  }

  const attachments = (documentRevision.attachments || []).map(
    (attachment: Attachment, index: number) => (
      <FileCard key={index} attachment={attachment} />
    ),
  );

  const renderReferences = () =>
    documentRevision.document &&
    documentRevision.document.referencedBy &&
    documentRevision.document.referencedBy.map((reference) => (
      <Link
        key={reference.id}
        to={documentVersionPath(reference.id, reference.document.id)}
        target="_blank"
      >
        {reference.name}
      </Link>
    ));

  return (
    <Grid container={true} className={classes.container} spacing={8}>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.documentId" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        <Typography variant="h6">{documentRevision.document.docId}</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.state" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        <Typography variant="h6">{documentRevision.status}</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.type" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        <Typography variant="h6">{documentRevision.document.documentType}</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.description" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        <Typography variant="h6">{documentRevision.description}</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.name" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        <Typography variant="h6">{documentRevision.name}</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Typography variant="h6">
          <Text translation="common.referenced.by" />
        </Typography>
      </Grid>
      <Grid item={true} xs={10}>
        {renderReferences()}
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true} spacing={8}>
          {attachments}
        </Grid>
      </Grid>
      <PreviewControlsContainer documentRevision={documentRevision} />
    </Grid>
  );
};

export default withStyles(styles)(DocumentRevisionPreviewPresenter);

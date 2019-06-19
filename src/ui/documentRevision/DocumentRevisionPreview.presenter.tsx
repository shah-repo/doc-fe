import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Attachment } from "../../state/ducks/attachments";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import FileCard from "../components/cards/FileCard";
import Text from "../components/Text";
import styles from "./DocumentRevisionPreview.styles";
import { documentRevisionIdMask } from "./helpers";
import PendingSubmissionDialogContainer from "./dialogs/PendingSubmissionDialog.container";

interface DocumentRevisionPreviewPresenterProps extends WithStyles<typeof styles> {
  documentRevision: DocumentRevision | null;
  canSubmitDocument: boolean | null;
}

const DocumentRevisionPreviewPresenter: React.FunctionComponent<DocumentRevisionPreviewPresenterProps> =
  ({ classes, documentRevision, canSubmitDocument }) => {
    if (!documentRevision) { return null; }
    const renderPendingSubmissionButton = () => {
      return (
        canSubmitDocument && <PendingSubmissionDialogContainer
          transition="pending_submission"
          documentRevisionId={documentRevision.id}
        />
      )
    }

    const attachments = (documentRevision.attachments || []).map((attachment: Attachment, index: number) => (
      <FileCard key={index} attachment={attachment} />
    ));

    const referencedBy = documentRevision.referencedBy.map((reference, index) => (
      <Grid container={true} key={index}>
        <Grid item={true} xs={3}>
          <Typography>{index + 1}. <strong>{reference.name}</strong></Typography>
        </Grid>
      </Grid>
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
        <Grid item={true} xs={2}>
          <Typography variant="h6">
            <Text translation="documentRevision.form.referencedBy" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          {documentRevision.referencedBy.map((reference, index) => reference.name )}
        </Grid>
        <Grid item={true} xs={12}>
          <Grid container={true} spacing={8}>
            {attachments}
          </Grid>
        </Grid>
        <Grid>
          {renderPendingSubmissionButton()}
        </Grid>
      </Grid>
    );
  };

export default withStyles(styles)(DocumentRevisionPreviewPresenter);

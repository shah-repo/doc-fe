import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import moment from "moment-timezone";
import React from "react";
import { Attachment } from "../../state/ducks/attachments";
import { Document, DocumentTransition } from "../../state/ducks/documents";
import FileCard from "../components/cards/FileCard";
import DocumentTransitionDialogContainer from "./dialogs/DocumentTransitionDialog.container";
import styles from "./DocumentPreview.styles";

interface DocumentPreviewPresenterProps extends WithStyles<typeof styles> {
  document: Document;
  canSendToReview: boolean;
  canWithdraw: boolean;
  canApproveOrReject: boolean;
}

const DocumentPreviewPresenter: React.FunctionComponent<DocumentPreviewPresenterProps> =
  ({ classes, document, canApproveOrReject, canSendToReview, canWithdraw }) => {
    const renderButton = (condition: boolean, transition: DocumentTransition, buttonProps?: ButtonProps) =>
      condition && (
        <DocumentTransitionDialogContainer
          transition={transition}
          documentId={document.id}
          buttonProps={buttonProps}
        />
      );

    const approvals = document.approvals.map((approval, index) => (
      <Grid container={true} key={index}>
        <Grid item={true} xs={3}>
          <Typography>{index + 1}. <strong>{approval.approver.email}</strong></Typography>
        </Grid>
        <Grid item={true} xs={3}>
        <Typography>{approval.status}</Typography>
        </Grid>
        <Grid item={true} xs={6}>
          <Typography>{approval.reviewedAt && moment(approval.reviewedAt).calendar()}</Typography>
        </Grid>
      </Grid>
    ));

    const attachments = document.attachments.map((attachment: Attachment, index: number) => (
      <FileCard key={index} attachment={attachment} />
    ));

    return (
      <Grid container={true} className={classes.container} spacing={8}>
        <Grid item={true} xs={12}>
          <Typography variant="h4">
            {document.name}
          </Typography>
        </Grid>
        <Grid item={true} xs={8}>
          <Typography variant="h5">
            {document.type}
          </Typography>
        </Grid>
        <Grid item={true} xs={4}>
          <Typography variant="h5" align="right">
            {document.status}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          {approvals}
        </Grid>
        <Grid item={true} xs={12}>
          <Grid container={true} spacing={8}>
            {attachments}
          </Grid>
        </Grid>
        <Grid item={true} xs={12}>
          <div className={classes.actionButtons}>
            {renderButton(canSendToReview, "to_review")}
            {renderButton(canWithdraw, "withdraw")}
            {renderButton(canApproveOrReject, "reject", { color: "secondary" })}
            {renderButton(canApproveOrReject, "approve")}
          </div>
        </Grid>
      </Grid>
    );
  };

export default withStyles(styles)(DocumentPreviewPresenter);

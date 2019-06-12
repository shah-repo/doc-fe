import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import moment from "moment";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest, ChangeRequestTransition } from "../../../state/ducks/changeRequest";
import FileCard from "../../components/cards/FileCard";
import ChangeRequestTransitionDialogContainer from "../dialogs/ChangeRequestTransitionDialog.container";
import styles from "../ChangeRequestPreview.styles";
import Text from "../../components/Text";

interface AssessmentPreviewPresenterProps extends WithStyles<typeof styles> {
  changeRequest: ChangeRequest;
  canSendToReview: boolean;
  canWithdraw: boolean;
  canApproveOrReject: boolean;
}

const AssessmentPreviewPresenter: React.FunctionComponent<AssessmentPreviewPresenterProps> =
  ({ classes, changeRequest, canApproveOrReject, canSendToReview, canWithdraw }) => {
    const renderButton = (condition: boolean, transition: ChangeRequestTransition, buttonProps?: ButtonProps) =>
      condition && (
        <ChangeRequestTransitionDialogContainer
          transition={transition}
          changeRequestId={changeRequest.id}
          buttonProps={buttonProps}
        />
      );

    const approvals = changeRequest.approvals.map((approval, index) => (
      <Grid container={true} key={index}>
        <Grid item={true} xs={3}>
          <Typography>{index + 1}. <strong>{approval.approver.name}</strong></Typography>
        </Grid>
        <Grid item={true} xs={3}>
        <Typography>{approval.status}</Typography>
        </Grid>
        <Grid item={true} xs={6}>
          <Typography>{approval.reviewedAt && moment(approval.reviewedAt).calendar()}</Typography>
        </Grid>
      </Grid>
    ));

    const renderAttachments = (attachments: Attachment[]) =>
      attachments.map((attachment: Attachment, index: number) => (
        <FileCard key={index} attachment={attachment} />
      ));

    return (
      <Grid container={true} className={classes.container} spacing={24}>
        <Grid item={true} xs={2}>
          <Typography variant="h5">
            <Text translation="changeRequest.state" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h5">
            {changeRequest.state}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h5">
            <Text translation="changeRequest.assessmentForm.description" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h5">
            {changeRequest.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h5">
            <Text translation="changeRequest.assessmentForm.justifications" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h5">
            {changeRequest.justifications.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          {renderAttachments(changeRequest.justifications.attachments)}
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h5">
            <Text translation="changeRequest.assessmentForm.assessments" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h5">
            {changeRequest.assessment.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          {renderAttachments(changeRequest.assessment.attachments)}
        </Grid>
        <Grid item={true} xs={2}>
          <Typography variant="h5">
            <Text translation="changeRequest.assessmentForm.implementationPlan" />
          </Typography>
        </Grid>
        <Grid item={true} xs={10}>
          <Typography variant="h5">
            {changeRequest.implementationPlan.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          {renderAttachments(changeRequest.implementationPlan.attachments)}
        </Grid>
        <Grid item={true} xs={12}>
          {approvals}
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

export default withStyles(styles)(AssessmentPreviewPresenter);

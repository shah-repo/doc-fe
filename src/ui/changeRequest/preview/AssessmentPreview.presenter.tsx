import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { Attachment } from "../../../state/ducks/attachments";
import { ChangeRequest, ImplementationPlanTask } from "../../../state/ducks/changeRequest";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "../ChangeRequestPreview.styles";
import AssessmentFormControlsContainer from "../forms/assessmentForm/AssessmentFormControls.container";

interface AssessmentPreviewPresenterProps extends WithStyles<typeof styles> {
  changeRequest: ChangeRequest;
}

const AssessmentPreviewPresenter: React.FunctionComponent<AssessmentPreviewPresenterProps> =
  ({ classes, changeRequest }) => {
    const approvals = changeRequest.approvals.map((approval, index) => (
      <Grid item={true} xs={12} key={index}>
        <Grid container={true}>
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
      </Grid>
    ));

    const renderAttachments = (attachments: Attachment[]) =>
      <Grid item={true} xs={12}>
        {
          attachments.map((attachment: Attachment, index: number) => (
            <FileCard key={index} attachment={attachment} />
          ))
        }
      </Grid>

    const renderImplementationPlanTasks = (tasks: ImplementationPlanTask[]) => {
      return (
        <Grid item={true} xs={12}>
          {
            tasks.map((task) => (
              <Grid item={true} xs={12} key={task.id}>
                <Typography variant="h6" gutterBottom>
                  <Text translation="common.title" />:
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <Text translation="common.description" />:
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {task.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <Text translation="common.status" />:
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {task.status}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <Text translation="common.dueDate" />:
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {task.dueDate}
                </Typography>
              </Grid>
            ))
          }
        </Grid>
      )
    }

    return (
      <Grid container={true} className={classes.container} spacing={8}>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom>
            <Text translation="changeRequest.assessmentForm.description" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom>
            <Text translation="changeRequest.assessmentForm.justifications" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.justifications.description}
          </Typography>
        </Grid>
        {renderAttachments(changeRequest.justifications.attachments)}
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom>
            <Text translation="changeRequest.assessmentsDescription" />:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {changeRequest.assessments.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <Text translation="common.design" />:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {changeRequest.assessments.design.reasoning}
          </Typography>
          {changeRequest.assessments.design.attachment && renderAttachments([changeRequest.assessments.design.attachment])}
          <Typography variant="h6" gutterBottom>
            <Text translation="common.regulatory" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.assessments.regulatory.reasoning}
          </Typography>
          {changeRequest.assessments.regulatory.attachment && renderAttachments([changeRequest.assessments.regulatory.attachment])}
          <Typography variant="h6" gutterBottom>
            <Text translation="common.process" />:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {changeRequest.assessments.process.reasoning}
          </Typography>
          {changeRequest.assessments.process.attachment && renderAttachments([changeRequest.assessments.process.attachment])}
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom>
            <Text translation="changeRequest.assessmentForm.implementationPlan" />:
          </Typography>
          {renderAttachments(changeRequest.implementationPlan.attachments)}
          {renderImplementationPlanTasks(changeRequest.implementationPlan.tasks)}
        </Grid>
        <Grid item={true} xs={12}>
          {approvals}
        </Grid>
        <Grid item={true} xs={12}>
          <div className={classes.actionButtons}>
            <AssessmentFormControlsContainer changeRequest={changeRequest} />
          </div>
        </Grid>
      </Grid>
    );
  };

export default withStyles(styles)(AssessmentPreviewPresenter);

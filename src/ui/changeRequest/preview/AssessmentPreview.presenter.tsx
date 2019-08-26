import { Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import moment from "moment-timezone";
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
      </Grid>;

    const renderImplementationPlanTasks = (tasks: ImplementationPlanTask[]) => {
      return (
        <Grid item={true} xs={12}>
          {
            tasks.map((task) => (
              <Grid item={true} xs={12} key={task.id}>
                <Typography variant="h6" gutterBottom={true}>
                  <Text translation="common.title" />:
                </Typography>
                <Typography variant="h5" gutterBottom={true}>
                  {task.title}
                </Typography>
                <Typography variant="h6" gutterBottom={true}>
                  <Text translation="common.description" />:
                </Typography>
                <Typography variant="h5" gutterBottom={true}>
                  {task.description}
                </Typography>
                <Typography variant="h6" gutterBottom={true}>
                  <Text translation="common.status" />:
                </Typography>
                <Typography variant="h5" gutterBottom={true}>
                  {task.status}
                </Typography>
                <Typography variant="h6" gutterBottom={true}>
                  <Text translation="common.due.date" />:
                </Typography>
                <Typography variant="h5" gutterBottom={true}>
                  {task.dueDate}
                </Typography>
              </Grid>
            ))
          }
        </Grid>
      );
    };

    return (
      <Grid container={true} className={classes.container} spacing={8}>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.status" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.state}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.description" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.description}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.justifications" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.justifications.description}
          </Typography>
        </Grid>
        {renderAttachments(changeRequest.justifications.attachments)}
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="changeRequest.assessmentsDescription" />:
          </Typography>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.design" />:
          </Typography>
          <Typography variant="h5" gutterBottom={true}>
            {changeRequest.assessments.design.reasoning}
          </Typography>
          {changeRequest.assessments.design.attachments && renderAttachments(changeRequest.assessments.design.attachments)}
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.regulatory" />:
          </Typography>
          <Typography variant="h5">
            {changeRequest.assessments.regulatory.reasoning}
          </Typography>
          {changeRequest.assessments.regulatory.attachments && renderAttachments(changeRequest.assessments.regulatory.attachments)}
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.process" />:
          </Typography>
          <Typography variant="h5" gutterBottom={true}>
            {changeRequest.assessments.process.reasoning}
          </Typography>
          {changeRequest.assessments.process.attachments && renderAttachments(changeRequest.assessments.process.attachments)}
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="h6" gutterBottom={true}>
            <Text translation="common.implementation.plan" />:
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

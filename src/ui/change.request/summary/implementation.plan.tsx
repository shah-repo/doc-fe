import {
  Box,
  Button,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import ReactQuill from "react-quill";
import { getFormattedDateString } from "../../../common/utils/date";
import { sanitizeHtml } from "../../../common/utils/helpers";
import {
  changeRequestsActions,
  ChangeRequestStatus,
  ImplementationPlan as Model,
  ImplementationPlanTask,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";
import { canCloseTask } from "../utils/helpers";
import CloseTask from "./close.task";
import styles from "./styles";

interface OwnProps extends DataProps<Model> {
  currentUserEmail: string;
  crStatus: ChangeRequestStatus;
  closeTask: typeof changeRequestsActions.closeTask;
  crId: string;
}

export type Props = OwnProps & WithStyles<typeof styles>;

export const ImplementationPlan: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  crStatus,
  closeTask,
  crId,
}) => {
  const { tasks, attachments } = dataProp;

  const attachmentRenderer = () => (
    <AttachmentIconField
      name="implementationPlan.attachments"
      disabled={true}
    />
  );

  const closeTaskRenderer = (task: ImplementationPlanTask) =>
    canCloseTask(crStatus, task, currentUserEmail) && (
      <CloseTask crId={crId} taskId={task.id} closeTask={closeTask} />
    );

  const taskRenderer = () =>
    tasks.map((task, index) => (
      <Grid
        item={true}
        xs={12}
        key={`${task.id} ${index}`}
        className={classes.taskContainer}
      >
        <Typography variant="h5">
          <Text message={task.title} />
        </Typography>
        <ReactQuill
          readOnly={true}
          value={sanitizeHtml(task.description)}
          modules={{ toolbar: false }}
        >
          <div className={classes.taskDescription} />
        </ReactQuill>
        <Grid container={true} className={classes.taskBasicInformation}>
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.due.date" />:{" "}
            </Typography>
            <Box>
              <Typography variant="body2">
                <Text message={getFormattedDateString(task.dueDate)} />
              </Typography>
            </Box>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.assigned.to" />:{" "}
            </Typography>
            <Box>
              <Typography variant="body2">
                {task.assigned && task.assigned.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.state" />:
            </Typography>
            <Box>
              <Typography variant="body2">
                <Text message={task.status} />
                {task.closeDate && (
                  <Text
                    message={`, ${getFormattedDateString(task.closeDate)}`}
                  />
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {task.closingNote && (
          <SummaryField label="common.closing.note" value={task.closingNote} />
        )}
        {closeTaskRenderer(task)}
      </Grid>
    ));

  return (
    <Grid container={true} xs={12} className={classes.box}>
      <Typography variant="h6">
        <Text translation="common.implementation.plan" />
      </Typography>
      {taskRenderer()}
      {attachments && attachmentRenderer()}
    </Grid>
  );
};

export default withStyles(styles)(ImplementationPlan);

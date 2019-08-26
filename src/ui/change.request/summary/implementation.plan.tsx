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
import AttachmentIconField from "../../components/common/attachment.icon/container";
import { getFormattedDateString } from "../../../common/utils/date";
import {
  changeRequestsActions,
  ChangeRequestStatus,
  ImplementationPlan as Model,
  ImplementationPlanTask,
} from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import { canCloseTask } from "../utils/helpers";
import CloseTask from "./close.task";
import styles from "./styles";
import ReactQuill from "react-quill";
import { sanitizeHtml } from "../../../common/utils/helpers";

interface OwnProps extends DataProps<Model> {
  currentUserEmail: string;
  crStatus: ChangeRequestStatus;
  closeTask: typeof changeRequestsActions.closeTask;
  crId: string;
}

type Props = OwnProps & WithStyles<typeof styles>;

const ImplementationPlan: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  crStatus,
  closeTask,
  crId,
}) => {
  const { tasks, attachments } = dataProp;

  const attachmentRenderer = () => (
    <AttachmentIconField name="implementationPlan.attachments" />
  );

  const closeTaskRenderer = (task: ImplementationPlanTask) =>
    canCloseTask(crStatus, task, currentUserEmail) && (
      <CloseTask crId={crId} taskId={task.id} closeTask={closeTask} />
    );

  const taskRenderer = () =>
    tasks.map((task, index) => (
      <Grid
        item
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
          <Grid item xs={4}>
            <Typography variant="body2">
              <Text message="common.due.date" />:{" "}
              <Text message={getFormattedDateString(task.dueDate)} />
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">
              <Text message="common.assigned.to" />:{" "}
              {task.assigned && task.assigned.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">
              <Text message="common.state" />: <Text message={task.status} />
            </Typography>
          </Grid>
        </Grid>
        {task.closingNote && (
          <SummaryField label="common.closing.note" value={task.closingNote} />
        )}
        {closeTaskRenderer(task)}
      </Grid>
    ));

  return (
    <Grid item xs={12} className={classes.box}>
      <Typography variant="h6">
        <Text translation="common.implementation.plan" />
      </Typography>
      {taskRenderer()}
      {attachments && attachmentRenderer()}
    </Grid>
  );
};

export default withStyles(styles)(ImplementationPlan);

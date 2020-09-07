import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { getFormattedStartOfDayDateString } from "../../../common/utils/date";
import { changeRequestsActions, ChangeRequestStatus, ImplementationPlan as Model, ImplementationPlanTask } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import { convertHtmlToDraft } from "../../components/forms/fields/RichTextEditor/helpers";
import Text from "../../components/Text";
import { canCloseTask } from "../utils/helpers";
import CloseTask from "./close.task";

interface OwnProps extends DataProps<Model> {
  currentUserEmail: string;
  crStatus: ChangeRequestStatus;
  closeTask: typeof changeRequestsActions.closeTask;
  crId: string;
}

export type Props = OwnProps;

export const ImplementationPlan: React.FunctionComponent<Props> = ({
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

  // TODO: replace react quill
  const taskRenderer = () =>
    tasks.map((task, index) => (
      <Grid
        item={true}
        xs={12}
        key={`${task.id} ${index}`}

      >
        <Typography variant="h5">
          <Text message={task.title} />
        </Typography>
        <Editor
          readOnly={true}
          editorState={convertHtmlToDraft(task.description)}
          toolbarHidden={true}
        />
        <Grid container={true} >
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.due.date" />:{" "}
            </Typography>
            <Box>
              <Typography id="dueDate" variant="body2">
                <Text message={getFormattedStartOfDayDateString(task.dueDate)} />
              </Typography>
            </Box>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.assigned.to" />:{" "}
            </Typography>
            <Box>
              <Typography id="assignedTo" variant="body2">
                {task.assigned && task.assigned.user.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item={true} xs={4}>
            <Typography variant="body2">
              <Text message="common.state" />:
            </Typography>
            <Box>
              <Typography id="status" variant="body2">
                <Text message={task.status} />
                {task.closeDate && (
                  <Text
                    message={`, ${getFormattedStartOfDayDateString(task.closeDate)}`}
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
    <Grid container={true} xs={12}>
      <Typography variant="h6">
        <Text translation="common.implementation.plan" />
      </Typography>
      {taskRenderer()}
      {attachments && attachmentRenderer()}
    </Grid>
  );
};

export default ImplementationPlan;

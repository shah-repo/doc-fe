import {
  Box,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ImplementationPlanProps } from "../../../state/ducks/changeRequest";
import BaseSummaryField from "../../common/summary/base";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = ImplementationPlanProps & WithStyles<typeof styles>;

const ImplementationPlan: React.FunctionComponent<Props> = ({
  classes,
  implementationPlan,
}) => {

  const { tasks, attachments } = implementationPlan;

  const attachmentRenderer = () => attachments.map((attachment, index) => (
    <FileCard key={index} attachment={attachment} />
  ));

  const taskRenderer = () => tasks.map((task, index) => (
    <Box key={`${task.id} ${index}`}>
      <ListItem>
        <Typography variant="button"><Text message={`Task-${index + 1}`} />:</Typography>
      </ListItem>
      <BaseSummaryField label="common.title" value={task.title} />;
      <BaseSummaryField label="common.description" value={task.description} />;
      <BaseSummaryField label="common.due.date" value={task.dueDate} />;
      <BaseSummaryField label="common.assigned.to" value={task.assigned && task.assigned.name} />;
      <BaseSummaryField label="common.status" value={task.status} />;
    </Box>
  ));

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.implementation.plan" />:</Typography>
      </ListItem>
      {attachments && <ListItem><Grid container={true} spacing={2}>{attachmentRenderer()}</Grid></ListItem>}
      {taskRenderer()}
    </Box>
  );
};

export default withStyles(styles)(ImplementationPlan);

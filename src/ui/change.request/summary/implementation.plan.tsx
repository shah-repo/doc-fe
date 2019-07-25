import {
  Box,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import { ImplementationPlan as Model } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryField from "../../common/summary/base";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Model> & WithStyles<typeof styles>;

const ImplementationPlan: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  const { tasks, attachments } = dataProp;

  const attachmentRenderer = () => attachments.map((attachment, index) => (
    <FileCard key={index} attachment={attachment} />
  ));

  const taskRenderer = () => tasks.map((task, index) => (
    <Box key={`${task.id} ${index}`}>
      <ListItem>
        <Typography variant="button"><Text message={`Task-${index + 1}`} />:</Typography>
      </ListItem>
      <SummaryField label="common.title" value={task.title} />
      <SummaryField label="common.description" value={task.description} />
      <SummaryField label="common.due.date" value={moment.utc(task.dueDate).format("LL")} />
      <SummaryField label="common.assigned.to" value={task.assigned && task.assigned.name} />
      <SummaryField label="common.status" value={task.status} />
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

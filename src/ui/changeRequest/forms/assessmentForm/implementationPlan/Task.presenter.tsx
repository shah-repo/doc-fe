import React from "react";
import { createStyles, Button, makeStyles } from "@material-ui/core";
import { ImplementationPlanTask } from "../../types";
import Text from "../../../../components/Text";
import Date from "../../../../components/Date";

export interface Props {
  task: ImplementationPlanTask;
  removeTask: (index: number) => () => void;
  index: number;
}

export const styles = makeStyles(() =>
  createStyles({
    container: {
      border: '1px solid lightgray',
      margin: '10px 0',
      padding: 10,
      lineHeight: 2,
    },
    detailsContainer: {
      marginTop: 10,
      color: 'gray',
    },
    assignedTo: {
      marginRight: 20,
    },
    removeBtn: {
      float: 'right',
    },
  },
));

export const TaskPresenter: React.FunctionComponent<Props> = ({
  task, removeTask, index
}) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <div>{task.title}</div>
      <div>{task.description}</div>
      <div className={classes.detailsContainer}>
        <span className={classes.assignedTo}>
          <Text translation="common.assignedTo" />:&nbsp;
          {task.assigned.name}
        </span>
        <span>
          <Text translation="common.dueDate" />:&nbsp;
          <Date value={task.dueDate} />
        </span>
        <Button onClick={removeTask(index)} className={classes.removeBtn} color="secondary">
          <Text translation="common.remove" />
        </Button>
      </div>
    </div>
  )
};

export default TaskPresenter;

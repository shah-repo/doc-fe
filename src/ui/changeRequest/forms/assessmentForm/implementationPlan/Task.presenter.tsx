import React from "react";
import { createStyles, Button, makeStyles } from "@material-ui/core";
import { ImplementationPlanTask } from "../../types";
import Text from "../../../../components/Text";
import Date from "../../../../components/Date";

export interface Props {
  task: ImplementationPlanTask;
  removeTask: (index: number) => () => void;
  editTask: (task: ImplementationPlanTask, index: number) => () => void;
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
    marginRight: {
      marginRight: 20,
    },
    button: {
      float: 'right',
    },
  },
));

export const TaskPresenter: React.FunctionComponent<Props> = ({
  task, removeTask, index, editTask
}) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <div>{task.title}</div>
      <div>{task.description}</div>
      <div className={classes.detailsContainer}>
        <span className={classes.marginRight}>
          <Text translation="common.assignedTo" />:&nbsp;
          {task.assigned.name}
        </span>
        <span className={classes.marginRight}>
          <Text translation="common.dueDate" />:&nbsp;
          <Date value={task.dueDate} />
        </span>
        <span>
          <Text translation="common.status" />:&nbsp;
          {task.status}
        </span>
        <Button onClick={removeTask(index)} className={classes.button} color="secondary">
          <Text translation="common.remove" />
        </Button>
        <Button onClick={editTask(task, index)} className={classes.button} color="primary">
          <Text translation="common.edit" />
        </Button>
      </div>
    </div>
  )
};

export default TaskPresenter;

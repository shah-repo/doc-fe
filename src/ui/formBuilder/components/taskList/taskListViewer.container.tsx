import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../state/ducks/tasksList/reducer";
import styles from "./Tasks.module.css";
import TaskUser from "./TaskUser";

interface LocalProps {
  currentUser: string;
}

interface StateProps {
  tasks: any;
}

const mapStateToProps = ({ tasks }: ApplicationState): StateProps => ({
  tasks,
});

export type TaskListPresenterProps = LocalProps & StateProps;

const TaskListViewer: React.FunctionComponent<TaskListPresenterProps> = ({
  currentUser,
  tasks,
}) => {
  const [newTasks, setNewTasks] = useState(tasks);

  useEffect(() => {
    setNewTasks(tasks);
  }, [tasks]);

  const taskList = newTasks.map(
    (
      { title, description, assignee, due_date, status, attachments }: any,
      i: any,
    ) => {
      return (
        <TaskUser
          title={title}
          description={description}
          assignee={assignee}
          due_date={due_date}
          status={status}
          attachments={attachments}
          id={i}
          key={i}
          currentUser={currentUser}
        />
      );
    },
  );

  return (
    <div className={styles.implementationPlanContainer + " " + styles.userView}>
      <div className={styles.topImplementationContainer}>
        <h2 className={styles.implementationPlanTitle}>Implementation Plan</h2>
      </div>
      {taskList}
    </div>
  );
};

export default connect(mapStateToProps)(TaskListViewer);

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formReducerType } from "../../../../state/ducks/formBuilder/reducer";
import styles from "./Tasks.module.css";
import TaskUser from "./TaskUser";

interface LocalProps {
  currentUser: string;
}

interface StateProps {
  tasks: any;
}

const mapStateToProps = ({
  formBuilderState,
}: formReducerType): StateProps => ({
  tasks: formBuilderState.tasks,
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
      { title, description, assignee, dueDate, status, attachments }: any,
      i: any,
    ) => (
      <TaskUser
        title={title}
        description={description}
        assignee={assignee}
        dueDate={dueDate}
        status={status}
        attachments={attachments}
        id={i}
        key={i}
        currentUser={currentUser}
      />
    ),
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

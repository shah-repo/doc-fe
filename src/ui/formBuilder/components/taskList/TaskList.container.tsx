import React from "react";
import TaskListPresenter from "./TaskList.presenter";
import TaskListViewer from "./taskListViewer.container";

interface StateProps {
  currentUserEmail: string;
  currentUser: string;
}

export type TaskListContainerProps = StateProps;

const TaskListContainer: React.FunctionComponent<TaskListContainerProps> = ({
  currentUser,
}) => {
  // if (!canEditDocument(document, currentUserEmail)) {
  //   return <Redirect to={generateDocumentPreviewPath(document.id)} />;
  // }

  if (currentUser !== "admin") {
    return <TaskListViewer currentUser={currentUser} />;
  }

  return <TaskListPresenter currentUser={currentUser} />;
};

export default TaskListContainer;

import React from "react";
import { ImplementationPlanTaskFormValues } from "../../types";
import TaskPresenter from "./Task.presenter";
import TaskFormDialog from "./TaskFormDialog";

interface OwnProps {
  tasks: ImplementationPlanTaskFormValues[];
  openDialog: () => void;
  closeDialog: () => void;
  onSubmit: (values: ImplementationPlanTaskFormValues) => void;
  selectedTask: ImplementationPlanTaskFormValues | null;
  isDialogOpen: boolean;
  numberOfTasks: number;
  removeTask: (index: number) => () => void;
  editTask: (task: ImplementationPlanTaskFormValues, index: number) => () => void;
}

export type Props = OwnProps;

const TasksPresenter: React.FunctionComponent<Props> = ({
  tasks,
  openDialog,
  closeDialog,
  onSubmit,
  selectedTask,
  isDialogOpen,
  numberOfTasks,
  removeTask,
  editTask,
}) => {
  const renderAddButton = () => (
    <TaskFormDialog
      openDialog={openDialog}
      isDialogOpen={isDialogOpen}
      closeDialog={closeDialog}
      onSubmit={onSubmit}
      task={selectedTask}
    />
  );

  if (numberOfTasks === 0) {
    return renderAddButton();
  }

  return (
    <div>
      {
        tasks.map((task: ImplementationPlanTaskFormValues, index: number) => (
          <TaskPresenter
            key={index}
            task={task}
            removeTask={removeTask}
            index={index}
            editTask={editTask}
          />
        ))
      }
      {renderAddButton()}
    </div>
  );
};

export default TasksPresenter;

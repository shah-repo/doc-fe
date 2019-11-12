import { FieldArrayRenderProps } from "formik";
import React, { useState } from "react";
import { applyTimezoneToDate } from "../../../../../common/utils/date";
import useDialog from "../../../../hooks/useDialog";
import { ImplementationPlanTaskFormValues } from "../../types";
import TasksPresenter from "./Tasks.presenter";

export type Props = FieldArrayRenderProps;

export const TasksContainer: React.FunctionComponent<Props> = ({
  push,
  remove,
  form,
  replace,
}) => {
  const dialog = useDialog();
  const [selectedTask, changeSelectedTask] = useState<ImplementationPlanTaskFormValues | null>(null);
  const [selectedIndex, changeSelectedIndex] = useState<number | null>(null);

  const openDialog = () => {
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
    changeSelectedTask(null);
    changeSelectedIndex(null);
  };

  const onSubmit = (values: ImplementationPlanTaskFormValues) => {
    closeDialog();

    if (selectedIndex !== null) {
      replace(selectedIndex, values);
    } else {
      push(values);
    }
  };

  const tasks = form.values.implementationPlan.tasks;
  const numberOfTasks = tasks.length;
  const removeTask = (index: number) => () => remove(index);
  const editTask = (task: ImplementationPlanTaskFormValues, index: number) => () => {
    changeSelectedIndex(index);
    changeSelectedTask({
      ...task,
      dueDate: task.dueDate ? applyTimezoneToDate(task.dueDate) : undefined,
    });
    dialog.open();
  };

  return (
    <TasksPresenter
      removeTask={removeTask}
      openDialog={openDialog}
      closeDialog={closeDialog}
      numberOfTasks={numberOfTasks}
      editTask={editTask}
      onSubmit={onSubmit}
      selectedTask={selectedTask}
      tasks={tasks}
      isDialogOpen={dialog.isOpen}
    />
  );
};

export default TasksContainer;

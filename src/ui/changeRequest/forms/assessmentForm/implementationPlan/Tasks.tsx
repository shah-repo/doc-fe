import { FieldArrayRenderProps } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import moment from "moment";
import useDialog from "../../../../hooks/useDialog";
import { ImplementationPlanTask, ImplementationPlanTaskForm, ImplementationPlanTaskFormValues } from "../../types";
import TaskPresenter from "./Task.presenter";
import TaskFormDialog from "./TaskFormDialog";

type Props = FieldArrayRenderProps;

const Tasks: React.FunctionComponent<Props> = ({
  push,
  remove,
  form,
  replace,
}) => {
  const dialog = useDialog();
  const [selectedTask, changeSelectedTask] = useState<ImplementationPlanTaskForm | null>(null);
  const [selectedIndex, changeSelectedIndex] = useState<number | null>(null);

  const openDialog = () => {
    dialog.open();
  };
  const closeDialog = () => {
    dialog.close();
    changeSelectedTask(null);
    changeSelectedIndex(null);
  };

  const onSubmit = (values: ImplementationPlanTaskForm) => {
    closeDialog()

    if (selectedIndex !== null) {
      replace(selectedIndex, values);
    } else {
      push(values);
    }
  };

  const tasks = form.values.implementationPlan.tasks;
  const numberOfTasks = tasks.length;
  const renderAddButton = () => (
    <TaskFormDialog
      openDialog={openDialog}
      isDialogOpen={dialog.isOpen}
      closeDialog={closeDialog}
      onSubmit={onSubmit}
      task={selectedTask}
    />
  );
  const removeTask = (index: number) => () => remove(index);
  const editTask = (task: ImplementationPlanTaskFormValues, index: number) => () => {
    changeSelectedIndex(index);
    changeSelectedTask({
      ...task,
      dueDate: moment(task.dueDate).toDate(),
    });
    dialog.open();
  };

  if (numberOfTasks === 0) {
    return renderAddButton();
  }

  return (
    <div>
      {
        tasks.map((task: ImplementationPlanTaskFormValues, index: number) => {
          return (
            <TaskPresenter
              key={index}
              task={task}
              removeTask={removeTask}
              index={index}
              editTask={editTask}
            />
          );
        })
      }
      {renderAddButton()}
    </div>
  );
};

export default Tasks;

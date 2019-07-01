import { FieldArrayRenderProps } from "formik";
import _ from "lodash";
import React from "react";
import useDialog from "../../../../hooks/useDialog";
import { ImplementationPlanTask, ImplementationPlanTaskForm } from "../../types";
import TaskPresenter from "./Task.presenter";
import TaskFormDialog from "./TaskFormDialog";

type Props = FieldArrayRenderProps;

const Tasks: React.FunctionComponent<Props> = ({
  push,
  remove,
  form,
}) => {
  const dialog = useDialog();

  const openDialog = () => {
    dialog.open();
  };

  const onSubmit = (values: ImplementationPlanTaskForm) => {
    dialog.close();
    const assigned: any = values.assigned;
    push({
      ...values,
      assigned: {
        id: assigned!.value,
      },
    });
  };

  const tasks = form.values.implementationPlan.tasks;
  const numberOfTasks = tasks.length;
  const renderAddButton = () => (
    <TaskFormDialog
      openDialog={openDialog}
      isDialogOpen={dialog.isOpen}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
    />
  );
  const removeTask = (index: number) => () => remove(index);

  if (numberOfTasks === 0) {
    return renderAddButton();
  }

  return (
    <div>
      {
        tasks.map((task: ImplementationPlanTask, index: number) => {
          return (
            <TaskPresenter key={index} task={task} removeTask={removeTask} index={index} />
          );
        })
      }
      {renderAddButton()}
    </div>
  );
};

export default Tasks;

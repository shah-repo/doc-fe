import { FieldArrayRenderProps } from "formik";
import React from "react";
import TaskForm from './TaskForm';
import TaskFormDialog from "./TaskFormDialog";
import useDialog from "../../../../hooks/useDialog";
import { ImplementationPlanTask } from "../../types";

interface Props extends FieldArrayRenderProps {}

const Tasks: React.FunctionComponent<Props> = ({
  push, pop, form,
}) => {
  const dialog = useDialog();

  const openDialog = () => {
    dialog.open();
  };

  const onSubmit = (values: ImplementationPlanTask) => {
    dialog.close();
    push(values);
  };

  const tasks = form.values.implementationPlan.implementationPlanTasks;
  const numberOfTasks = tasks.length;
  const renderAddButton = () => (
    <TaskFormDialog
      openDialog={openDialog}
      isDialogOpen={dialog.isOpen}
      closeDialog={dialog.close}
      onSubmit={onSubmit}
    />
  )

  if (numberOfTasks === 0) {
    return renderAddButton();
  }

  return (
    <div>
      {
        tasks.map((task: ImplementationPlanTask, index: number) => {
          return (
            <div key={index} >{task.description}</div>
          );
        })
      }
      {renderAddButton()}
    </div>
  );
};

export default Tasks;

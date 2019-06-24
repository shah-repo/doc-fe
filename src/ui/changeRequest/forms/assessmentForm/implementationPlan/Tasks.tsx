import { FieldArrayRenderProps } from "formik";
import _ from 'lodash';
import React from "react";
import TaskFormDialog from "./TaskFormDialog";
import useDialog from "../../../../hooks/useDialog";
import { ImplementationPlanTask } from "../../types";
import TaskPresenter from "./Task.presenter";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";

interface Props extends FieldArrayRenderProps {}

const Tasks: React.FunctionComponent<Props> = ({
  push, remove, form
}) => {
  const dialog = useDialog();

  const openDialog = () => {
    dialog.open();
  };

  const onSubmit = (values: ImplementationPlanTask) => {
    dialog.close();
    push({
      ...values,
      assigned: values.assigned.map((value: any) => ({ id: value.value, name: value.label }))
    });
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

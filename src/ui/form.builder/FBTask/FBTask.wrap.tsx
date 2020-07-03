import { filter, union } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBTaskFormDescription, FBTaskProps, FBTaskState } from "..";
import { FBTaskItem } from "./FBTask.types";

export const withFBTask = <T extends FBTaskProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    taskState,
    dialogState,
    tasks,
    name,
    loading,
    disabled,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const {
      changeRequest: { tasks: crTasks = [] } = {},
      document: { tasks: docTasks = [] } = {},
    } = workspaceState || {};
    const formValue: FBTaskItem[] = filter(union(crTasks, docTasks), (task) =>
      task.fieldId === name && task.status !== "ABANDONED");
    taskState = FB.useRef(FBTaskState, formValue);
    dialogState = FB.useRef(FBDialogState);
    disabled = loading || disabled;

    onClick = (id?: string) => {
      const initialValues = taskState?.getTask(id);
      const title = initialValues ?
        "form.builder.edit.implementation.task" :
        "form.builder.add.implementation.task";

      dialogState?.config({
        open: true,
        title,
        content: (
          <FBTaskFormDescription
            actionMode="description"
            {...{ initialValues, name }}
          />
        ),
      });
    };

    useObserver(() => {
      loading = taskState?.loading;
    });

    return Component({
      ...(props as T),
      onClick,
      taskState,
      dialogState,
      tasks: taskState?.tasks,
      name,
      loading,
      disabled,
    });
  };

  Comp.displayName = "withFBTask";
  return Comp;
};

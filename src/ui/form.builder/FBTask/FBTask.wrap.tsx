import { filter } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBTaskForm, FBTaskProps, FBTaskState } from "..";
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
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const { document: { tasks: docTasks = [] } = {} } = workspaceState || {};
    const formValue: FBTaskItem[] = filter(docTasks, (task) =>
      task.fieldId === name && task.status !== "ABANDONED");
    taskState = FB.useRef(FBTaskState, formValue);
    dialogState = FB.useRef(FBDialogState);

    onClick = (id?: string) => {
      const initialValues = taskState?.getTask(id);
      const title = initialValues ?
        "form.builder.edit.implementation.task" :
        "form.builder.add.implementation.task";

      dialogState?.config({
        open: true,
        title,
        content: <FBTaskForm {...{ initialValues, name }} />,
      });
    };

    // React.useEffect(() => {
    //   reaction(
    //     () => taskState?.tasks,
    //     (tasks) => formState?.setFieldValue(name, tasks)
    //   );
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useObserver(() => {
      tasks = taskState?.tasks;
      loading = taskState?.taskApi.loading;
    });

    return Component({
      ...(props as T),
      onClick,
      taskState,
      dialogState,
      tasks,
      name,
      loading,
    });
  };

  Comp.displayName = "withFBTask";
  return Comp;
};

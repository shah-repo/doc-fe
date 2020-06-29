import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBTaskForm, FBTaskProps, FBTaskState } from "..";
import { Employee } from "../../../state/ducks/company";
import { FBTaskItem } from "./FBTask.types";

export const withFBTask = <T extends FBTaskProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    getApprover,
    taskState,
    dialogState,
    tasks,
    name,
    ...props
  }: T) => {

    const { formState } = FB.useStores();
    const formValue: FBTaskItem[] = formState?.getFieldValue(name);
    taskState = FB.useRef(FBTaskState, formValue);
    dialogState = FB.useRef(FBDialogState);

    onClick = (index = taskState?.tasks?.length || 0) => {
      const initialValues = taskState?.getTask(index);
      const title = initialValues ?
        "form.builder.edit.implementation.task" :
        "form.builder.add.implementation.task";

      dialogState?.config({
        open: true,
        title,
        content: <FBTaskForm {...{ index, initialValues }} />,
      });
    };

    getApprover = (id: string): Employee =>
      taskState?.approversApi.sliceValue(id);

    React.useEffect(() => {
      reaction(
        () => taskState?.tasks,
        (tasks) => formState?.setFieldValue(name, tasks)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useObserver(() => {
      tasks = taskState?.tasks;
    });

    return Component({
      ...(props as T),
      onClick,
      getApprover,
      taskState,
      dialogState,
      tasks,
      name,
    });
  };

  Comp.displayName = "withFBTask";
  return Comp;
};

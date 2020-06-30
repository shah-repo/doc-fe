import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBTaskFieldProps, FBTaskFieldState, FBTaskItem } from "..";

export const withFBTaskField = <T extends FBTaskFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemoveTask,
    onMouseOver,
    onMouseLeave,
    getApprover,
    taskFieldState,
    visibility,
    ...props
  }: T) => {

    const { taskState } = FB.useStores();
    taskFieldState = FB.useRef(FBTaskFieldState);

    onMouseOver = () => taskFieldState?.setVisibility(true);
    onMouseLeave = () => taskFieldState?.setVisibility(false);

    getApprover = (task?: FBTaskItem): string => (
      task?.assigned.user?.name ||
      taskState?.approversApi.sliceValue(task?.assigned.id || "") ||
      ""
    );

    handleRemoveTask = (task?: FBTaskItem) => taskState?.removeTask(task);

    useObserver(() => {
      visibility = taskFieldState?.visibility;
    });

    return Component({
      ...(props as T),
      onClick,
      handleRemoveTask,
      onMouseOver,
      onMouseLeave,
      taskFieldState,
      visibility,
    });
  };

  Comp.displayName = "withFBTaskField";
  return Comp;
};

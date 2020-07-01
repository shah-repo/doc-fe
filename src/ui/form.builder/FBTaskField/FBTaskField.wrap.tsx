import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBTaskFieldProps, FBTaskFieldState, FBTaskFormNote, FBTaskItem } from "..";

export const withFBTaskField = <T extends FBTaskFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleRemoveTask,
    onMouseOver,
    onMouseLeave,
    getApprover,
    handleClosingNote,
    taskFieldState,
    visibility,
    isInReview,
    task,
    ...props
  }: T) => {

    const { taskState, workspaceState, dialogState } = FB.useStores();
    taskFieldState = FB.useRef(FBTaskFieldState);
    isInReview = workspaceState?.documentStatus === "IN_REVIEW";

    onMouseOver = () => taskFieldState?.setVisibility(true);
    onMouseLeave = () => taskFieldState?.setVisibility(false);

    getApprover = (task?: FBTaskItem): string => (
      task?.assigned.user?.name ||
      taskState?.approversApi.sliceValue(task?.assigned.id || "") ||
      ""
    );

    handleRemoveTask = (task?: FBTaskItem) => taskState?.removeTask(task);

    handleClosingNote = () => {
      dialogState?.config({
        open: true,
        title: "Implementation Task Closing Note",
        content: <FBTaskFormNote mode="note" schema={task.closingNoteSchema} />,
      });
    };

    useObserver(() => {
      visibility = taskFieldState?.visibility;
    });

    return Component({
      ...(props as T),
      onClick,
      handleRemoveTask,
      onMouseOver,
      onMouseLeave,
      getApprover,
      handleClosingNote,
      taskFieldState,
      visibility,
      isInReview,
      task,
    });
  };

  Comp.displayName = "withFBTaskField";
  return Comp;
};

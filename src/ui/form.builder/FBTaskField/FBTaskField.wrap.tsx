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
    handleClosingNote,
    taskFieldState,
    canBeDone,
    visibility,
    task,
    ...props
  }: T) => {

    const { taskState, dialogState, workspaceState } = FB.useStores();
    const { currentUser } = workspaceState || {};
    taskFieldState = FB.useRef(FBTaskFieldState);
    canBeDone = currentUser?.id === task.assigned.user?.id && task.status === "PENDING";

    onMouseOver = () => taskFieldState?.setVisibility(task.status === "DRAFT");
    onMouseLeave = () => taskFieldState?.setVisibility(false);
    handleRemoveTask = (task?: FBTaskItem) => taskState?.removeTask(task);

    handleClosingNote = () => {
      dialogState?.config({
        open: true,
        title: "form.builder.closing.note.title",
        content: (
          <FBTaskFormNote
            initialValues={{ id: task.id }}
            actionMode="note"
            schema={task.closingNoteSchema}
          />
        ),
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
      handleClosingNote,
      taskFieldState,
      canBeDone,
      visibility,
      task,
    });
  };

  Comp.displayName = "withFBTaskField";
  return Comp;
};

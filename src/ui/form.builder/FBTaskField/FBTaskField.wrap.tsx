import { useObserver } from "mobx-react";
import moment from "moment";
import React from "react";
import { FB, FBTaskFieldProps, FBTaskFieldState, FBTaskFormNote, FBTaskItem } from "..";
import { TIME_ZONE } from "../../../common/utils/date";

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
    visibility,
    canBeDone,
    task,
    ...props
  }: T) => {

    const { taskState, workspaceState, dialogState } = FB.useStores();
    taskFieldState = FB.useRef(FBTaskFieldState);
    const { documentStatus = "DRAFT", changeRequestStatus = "DRAFT" } = workspaceState || {};
    canBeDone = (
      documentStatus === "IN_REVIEW" ||
      changeRequestStatus === "IN_REVIEW" ||
      changeRequestStatus === "IMPLEMENTATION"
    );

    function getApprover(): string {
      return (
        task?.assigned.user?.name ||
        taskState?.approversApi.sliceValue(task?.assigned.id || "") ||
        ""
      );
    }

    function getDueDate(): string {
      return moment(task.dueDate).tz(TIME_ZONE, true).format("MMMM D, YYYY");
    }

    onMouseOver = () => taskFieldState?.setVisibility(task.status !== "PENDING");
    onMouseLeave = () => taskFieldState?.setVisibility(false);
    handleRemoveTask = (task?: FBTaskItem) => taskState?.removeTask(task);

    handleClosingNote = () => {
      dialogState?.config({
        open: true,
        title: "Implementation Task Closing Note",
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
      visibility,
      canBeDone,
      task: {
        ...task,
        assignee: getApprover(),
        dueDate: getDueDate(),
      },
    });
  };

  Comp.displayName = "withFBTaskField";
  return Comp;
};

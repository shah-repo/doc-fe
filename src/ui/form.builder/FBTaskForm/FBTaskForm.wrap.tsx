import { omit, pick } from "lodash";
import React from "react";
import { FB, FBClosingNoteProps, FBData, FBFormState, FBTaskActionMode, FBTaskFormActions, FBTaskFormProps, FBTaskItem } from "..";
import { toastError } from "../../components/notifications";

export const withFBTaskForm = <T extends FBTaskFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    initialValues,
    actionMode = "description",
    name,
    ...props
  }: T) => {

    const { dialogState, workspaceState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });
    const { taskState } = FB.useStores();
    const { id } = workspaceState || {};

    function handleAdd() {
      if (!id) {
        toastError("Adding a task is possible only for output document.");
        return handleCancel();
      }
      handleCancel();
      const post: Record<FBTaskActionMode, () => any> = {
        description: () => handleAddDescription(),
        note: () => handleAddNote(),
      };
      post[actionMode]();
    }

    function handleAddDescription() {
      const formValue = formState?.getValues();
      taskState?.setTask({
        ...pick(formValue, ["dueDate", "id"]),
        descriptionSchema: FBData.taskSchema,
        closingNoteSchema: FBData.closingTaskSchema,
        ...pick(formValue, "descriptionInput"),
        type: "CR_IMPLEMENTATION_PLAN",
        assigned: {
          id: formValue?.assigned.id,
        },
        fieldId: name,
        partOf: { id },
      } as FBTaskItem);
    }

    function handleAddNote() {
      const formValues = formState?.getValues() as FBClosingNoteProps;
      const task = {
        id: formValues.id,
        closingNoteInput: omit(formValues, "id"),
      };
      taskState?.taskDone(task);
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    React.useEffect(() => {
      dialogState?.setActions(
        <FBTaskFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      formState,
      initialValues,
      actionMode,
    });
  };

  Comp.displayName = "withFBTaskForm";
  return Comp;
};

import { useFormikContext } from "formik";
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
    const formik = useFormikContext();
    const { dialogState, workspaceState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, {
      initialValues: {
        ...omit(initialValues, "descriptionInput"),
        ...initialValues?.descriptionInput,
      },
    });
    const { taskState } = FB.useStores();
    const { id } = workspaceState || {};

    function handleAdd() {
      if (!id) {
        toastError("Please save the document first.");
        return handleCancel();
      }
      handleCancel();
      const post: Record<FBTaskActionMode, () => any> = {
        description: () => handleAddDescription(),
        note: () => handleAddNote(),
      };
      post[actionMode]();
      // Adding task marks form as dirty but has separate request for saving tasks
      // This is solution for triggering prompt for unsaved changes
      formik.resetForm();
    }

    function handleAddDescription() {
      const formValue = formState?.getValues();
      taskState?.setTask({
        ...pick(formValue, ["id", "dueDate"]),
        descriptionSchema: FBData.taskSchema,
        closingNoteSchema: FBData.closingTaskSchema,
        descriptionInput: {
          ...omit(formValue, ["id", "dueDate", "assigned"]),
        },
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
      taskState?.finishTask(task);
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

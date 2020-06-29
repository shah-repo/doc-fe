import React from "react";
import { FB, FBFormState, FBTaskFormActions, FBTaskFormProps } from "..";
import { FBTaskItem } from "../FBTask/FBTask.types";

export const withFBTaskForm = <T extends FBTaskFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    initialValues,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });
    const { taskState } = FB.useStores();

    function handleAdd() {
      const formValue = formState?.getValues();
      taskState?.setTask(formValue as FBTaskItem);
      handleCancel();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    React.useEffect(() => {
      dialogState?.setActions(<FBTaskFormActions {...{ handleAdd, handleCancel }} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      formState,
      initialValues,
    });
  };

  Comp.displayName = "withFBTaskForm";
  return Comp;
};

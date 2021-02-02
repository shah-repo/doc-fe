import React from "react";
import { FB, FBAttachment, FBFileDescriptionActions, FBFileDescriptionProps, FBFormState } from "..";

export const withFBFileDescription = <T extends FBFileDescriptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    fileDescription,
    ...props
  }: T) => {
    // MARK: @config
    const { filePresenterState, dialogState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, {
      initialValues: { description: fileDescription },
    });

    React.useEffect(() => {
      dialogState?.setActions(
        <FBFileDescriptionActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions

    // MARK: @helpers
    function handleAdd() {
      const formValues = formState?.getValues() as Partial<FBAttachment>;
      filePresenterState?.patchFile(formValues);
      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    return Component({
      ...(props as T),
      formState,
      fileDescription,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};

import React from "react";
import { FB, FBEBPartFormActions, FBEBPartFormProps, FBFormState } from "..";

export const withFBEBPartForm = (
  Component: React.FunctionComponent<FBEBPartFormProps>,
) => {
  const Comp = ({
    ...props
  }) => {

    // MARK: @config
    const { dialogState } = FB.useStores();
    const formState = FB.useRef(FBFormState, {});

    React.useEffect(() => {
      dialogState?.setActions(
        <FBEBPartFormActions {...{ onDialogConfirm, onDialogClose }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @methods
    const onDialogConfirm = () => {
      // TODO Add part logic
      onDialogClose();
    };

    const onDialogClose = () => {
      dialogState?.closeDialog();
      formState?.setFieldValue("name", null);
    };

    return Component({
      ...(props),
      formState,
      dialogState,
    });
  };
  Comp.displayName = "withFBEBPartForm";
  return Comp;
};

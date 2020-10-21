import React from "react";
import { FB, FBEBPartDialogActions } from "..";
import { FBEBPartDialogProps } from "./FBEBPartDialog.types";

export const withFBEBPartDialog = (
  Component: React.FunctionComponent<FBEBPartDialogProps>,
) => {
  const Comp = ({
    name,
    ...props
  }) => {

    // MARK: @config
    const { formState, dialogState } = FB.useStores();

    React.useEffect(() => {
      dialogState?.setActions(
        <FBEBPartDialogActions {...{ onDialogConfirm, onDialogClose }} />
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
      formState?.setFieldValue(`fb-ebpart-title-${name}`, null);
    };

    return Component({
      ...(props),
      formState,
      dialogState,
      name,
    });
  };
  Comp.displayName = "withFBEBPartDialog";
  return Comp;
};

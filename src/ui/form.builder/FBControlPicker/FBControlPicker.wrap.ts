import React from "react";
import { FB, FBControlPickerProps, FBControlPickerState } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";

export const withFBControlPicker = <T extends FBControlPickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    controlPickerState,
    pickers,
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    controlPickerState = FB.useRef<FBControlPickerState>(FBControlPickerState, workspaceState);

    return Component({
      ...(props as T),
      controlPickerState,
      pickers: controlPickerState?.pickers,
    });
  };

  return withFBEditorHelper((props: T) => Comp(props));
};

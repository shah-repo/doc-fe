import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorTextFieldWithRangeProps, FBFormState } from "..";

export const withFBEditorTextFieldWithRange = <T extends FBEditorTextFieldWithRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isInspectionVisible,
    isRangeVisible,
    ...props
  }: T) => {
  // MARK: @config
    const formState = FB.useRef<FBFormState>(FBFormState, {
      range: false,
      inspection: false,
    });
    isInspectionVisible = false;
    isRangeVisible = false;

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      isRangeVisible = formState.inputState.get("range")?.value;
      isInspectionVisible = formState.inputState.get("inspection")?.value;
    });

    return Component({
      ...(props as T),
      formState,
      isRangeVisible,
      isInspectionVisible,
    });
  };

  Comp.displayName = "withFBEditorTextFieldWithRange";
  return Comp;
};

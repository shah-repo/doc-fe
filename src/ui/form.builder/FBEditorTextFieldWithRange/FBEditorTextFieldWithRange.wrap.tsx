import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorTextFieldWithRangeProps, FBFormState } from "..";

export const withFBEditorTextFieldWithRange = <T extends FBEditorTextFieldWithRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isInspectionVisible,
    isRangeVisible,
    isPassValueVisible,
    ...props
  }: T) => {
  // MARK: @config
    isRangeVisible = false;
    const formState = FB.useRef<FBFormState>(FBFormState, {
      range: false,
      inspection: false,
      passValue: false,
      typeOfPassValue: "value",
    });


    /** Hardcoded from clickable - where should we get these from? */
    const aqlOptions = [
      {
        text: "0.065",
        value: 0.065,
      },
      {
        text: "0.1",
        value: 0.1,
      },
      {
        text: "0.15",
        value: 0.15,
      },
      {
        text: "0.25",
        value: 0.25,
      },
      {
        text: "0.4",
        value: 0.4,
      },
      {
        text: "0.65",
        value: 0.65,
      },
      {
        text: "1.0",
        value: 1.0,
      },
      {
        text: "1.5",
        value: 1.5,
      },
      {
        text: "2.5",
        value: 2.5,
      },
      {
        text: "4.0",
        value: 4.0,
      },
      {
        text: "6.5",
        value: 6.5,
      },
    ];

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      isRangeVisible = formState.inputState.get("range")?.value;
      isInspectionVisible = formState.inputState.get("inspection")?.value;
      isPassValueVisible = formState.inputState.get("passValue")?.value;
    });

    return Component({
      ...(props as T),
      formState,
      isRangeVisible,
      isInspectionVisible,
      isPassValueVisible,
      aqlOptions,
    });
  };

  Comp.displayName = "withFBEditorTextFieldWithRange";
  return Comp;
};

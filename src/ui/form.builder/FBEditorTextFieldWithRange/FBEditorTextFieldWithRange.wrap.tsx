import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FB, FBEditorTextFieldWithRangeProps, FBFormState } from "..";

export const withFBEditorTextFieldWithRange = <T extends FBEditorTextFieldWithRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    inputProps,
    ...props
  }: T) => {

    // MARK: @config
    const formState = FB.useRef<FBFormState>(FBFormState, { initialValues: inputProps });
    if (inputProps?.editorConfig?.range?.from || inputProps?.editorConfig?.range?.to) {
      formState?.setFieldValue("rangeOption", true);
      formState?.setFieldValue(
        "editorConfig.range.from",
        inputProps.editorConfig?.range?.from,
        true);
      formState?.setFieldValue(
        "editorConfig.range.to",
        inputProps.editorConfig?.range?.to,
        true);
    }
    if (inputProps?.editorConfig.inspection) {
      formState?.setFieldValue("editorConfig.inspection", true);
      formState?.setFieldValue(
        "passValue",
        inputProps?.editorConfig?.pass,
        true,
      );
      formState?.setFieldValue(
        "editorConfig.aql",
        inputProps?.editorConfig?.aql,
        true
      );
      formState?.setFieldValue(
        "editorConfig.fai",
        inputProps?.editorConfig?.fai,
        true
      );
      const passType = inputProps?.editorConfig?.pass?.type;
      if (passType) {
        formState?.setFieldValue(
          "editorConfig.pass.type",
          passType,
          true,
        );
        formState?.setFieldValue(
          `"editorConfig.pass${passType}`,
          true,
          true,
        );
        if (passType === "value") {
          formState?.setFieldValue(
            "editorConfig.pass.value.from",
            inputProps.editorConfig?.pass?.value?.from,
            true);
          formState?.setFieldValue(
            "editorConfig.pass.value.to",
            inputProps.editorConfig?.pass?.value?.to,
            true);
        }
        if (passType === "percentage") {
          formState?.setFieldValue(
            "editorConfig.pass.percentage.value",
            inputProps.editorConfig?.pass?.percentage?.value,
            true
          );
          formState?.setFieldValue(
            "editorConfig.pass.percentage.increase",
            inputProps.editorConfig?.pass?.percentage?.increase,
            true
          );
          formState?.setFieldValue(
            "editorConfig.pass.percentage.decrease",
            inputProps.editorConfig?.pass?.percentage?.decrease,
            true
          );
        }
      }
    }


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
    useEffect(() => reaction(
      () => formState?.inputState.get("rangeOption")?.value,
      (value: boolean) => {
        if (value) { return; }
        formState?.setFieldError("editorConfig.range", "");
        formState?.setFieldValue("editorConfig.range", undefined, true);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.inputState.get("passValue")?.value,
      (value: boolean) => {
        // Setting the pass type default value since defaultValue prop
        // does not trigger validation
        // TODO: implement initial validation on demand
        if (value) {
          formState?.setFieldValue("editorConfig.pass.type", "value", true);
          return;
        }
        formState?.setFieldValue("editorConfig.pass.type", undefined, true);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => formState?.inputState.get("editorConfig.pass.type")?.value,
      (value: string) => {
        // Depends on control validation. If all fields are required
        // in pass percentage control then this can be removed
        formState?.setFieldError("editorConfig.pass.percentage", "");
        formState?.setFieldError("editorConfig.pass.value", "");
        // Clear data
        formState?.setFieldValue("editorConfig.pass", { type: value });
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      formState,
      aqlOptions,
    });
  };

  Comp.displayName = "withFBEditorTextFieldWithRange";
  return Comp;
};

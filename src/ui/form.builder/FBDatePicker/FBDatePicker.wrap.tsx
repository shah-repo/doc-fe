import React from "react";
import { FB } from "..";
import { FBDatePickerProps } from "./FBDatePicker.types";


export const withDatePicker = <T extends FBDatePickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    editorProperties,
    value,
    defaultValue,
    name = "",
    withState,
    omitFormValue,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { isOutput } = workspaceState || {};
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;


    if ((isOutput || formState?.workspaceMode !== "design") && formState?.workspaceMode !== "formPreview") {
      if (!defaultValue && !value && defaultCurrentDate) {
        value = new Date();
        formState?.setFieldValue(name, value, withState, omitFormValue);
      }
    }


    return Component({
      ...(props as T),
      value,
      defaultValue,
      name,
      withState,
      omitFormValue,
      disablePastDates,
    });
  };

  return (props: T) => Comp(props);
};

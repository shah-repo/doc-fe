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
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { isOutput, formInput } = workspaceState || {};
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;

    value = formInput?.[name];


    if ((isOutput || formState?.workspaceMode !== "design") && formState?.workspaceMode !== "formPreview") {
      if (!defaultValue && !value  && defaultCurrentDate) {
        formState?.setFieldValue(name, new Date());
      }
    }

    return Component({
      ...(props as T),
      value,
      defaultValue,
      name,
      disablePastDates,
    });
  };

  return (props: T) => Comp(props);
};

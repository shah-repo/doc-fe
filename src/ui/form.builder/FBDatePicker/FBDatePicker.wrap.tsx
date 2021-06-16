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
    const { formState } = FB.useStores();
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;

    value = formState?.getFieldValue(name);

    if (!defaultValue && !value  && defaultCurrentDate) {
        formState?.setFieldValue(name, new Date());
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

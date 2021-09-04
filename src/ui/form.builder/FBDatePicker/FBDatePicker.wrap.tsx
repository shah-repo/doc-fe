import React from "react";
import { FB } from "..";
import { FBDatePickerProps } from "./FBDatePicker.types";


export const withDatePicker = <T extends FBDatePickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onDatePickerClick,
    onDatePickerClose,
    editorProperties,
    value,
    defaultValue,
    name = "",
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;
    const { id } = workspaceState || {};

    value = formState?.getFieldValue(name);

    if (!defaultValue && !value  && defaultCurrentDate) {
        formState?.setFieldValue(name, new Date());
    }

    onDatePickerClick = () => {
      if (formState?.isBackdropOpen) { return; }
      if (!name) { return; }
      if (!id) { return; }
      formState?.lockField({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    };

    onDatePickerClose = () => {
      setTimeout(() => {
        formState?.unlockField(name);
      }, 1000);
    };

    return Component({
      ...(props as T),
      onDatePickerClick,
      onDatePickerClose,
      value,
      defaultValue,
      name,
      disablePastDates,
    });
  };

  return (props: T) => Comp(props);
};

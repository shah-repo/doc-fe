import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { reaction } from "mobx";
import moment from "moment";
import React, { useEffect } from "react";
import { FB } from "..";
import { getStartOfDayDateString, TIME_ZONE } from "../../../common/utils/date";
import FBDatePickerState from "./FBDatePicker.state";
import { FBDatePickerProps } from "./FBDatePicker.types";


export const withDatePicker = <T extends FBDatePickerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    datePickerState,
    onDatePickerClick,
    onDatePickerClose,
    onChange,
    editorProperties,
    name = "",
    defaultValue,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    const initialValue = formState?.getFieldValue(name);
    datePickerState = FB.useRef(FBDatePickerState, initialValue);
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;
    const { id, isOutput } = workspaceState || {};

    function save(date?: string) {
      if (!date || !isOutput) { return; }
      formState?.setFieldValue(name, date);
      workspaceState?.saveDocRev(formState?.getValues());
    }

    useEffect(() => {
      const isUnderDefault = !defaultValue && !initialValue && defaultCurrentDate;
      if (isUnderDefault) {
        const nowDate = getStartOfDayDateString(moment(new Date()).tz(TIME_ZONE).toISOString());
        datePickerState?.setValue(nowDate);
        save(nowDate);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => reaction(
      () => datePickerState?.date,
      (date) => save(date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

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

    onChange = (_date: MaterialUiPickersDate | null, value?: string | null) => {
      datePickerState?.setValue(value);
    };

    return Component({
      ...(props as T),
      datePickerState,
      onDatePickerClick,
      onDatePickerClose,
      onChange,
      disablePastDates,
      defaultValue,
      name,
    });
  };

  return (props: T) => Comp(props);
};

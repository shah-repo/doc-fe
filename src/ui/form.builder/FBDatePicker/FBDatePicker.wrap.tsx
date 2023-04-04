import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FB } from "..";
import { SM } from "../../../App";
import { TIME_ZONE } from "../../../common/utils/date";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { useFormContext } from "../../components/forms/FormContext";
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
    const { submitForm } = useFormContext();
    const initialValue = formState?.getFieldValue(name);
    datePickerState = FB.useRef(FBDatePickerState, initialValue);
    const defaultCurrentDate = editorProperties?.includes("defaultCurrentDate") || false;
    const disablePastDates = editorProperties?.includes("disablePastDates") || false;
    const { id, isOutput } = workspaceState || {};
    const [approvalRequest, setApprovalRequest] = useState<ChangeRequest>();

    function save(date?: string) {
      if (!date) { return; }
      formState?.setFieldValue(name, date);
      formState?.validate();
      const isUnderWorkspace = workspaceState?.getSchemaItem(name);
      if (!isUnderWorkspace) { return; }

      if (workspaceState?.isChangeRequest) {
        submitForm();
        return;
      }

      workspaceState?.saveDocRev(formState?.getValues());
    }


    SM.reaction(
      () => workspaceState?.changeRequest,
      (value?: ChangeRequest) => {
        if (value) {
          setApprovalRequest(value);
        }
      }
    );

    useEffect(() => {
      // Populate with a default value if there is no default value, no initialValue, the editorProperties has
      //  defaultCurrentDate & the documentRevision is an output
      const isUnderDefault =
        !defaultValue &&
        !initialValue &&
        defaultCurrentDate &&
        (approvalRequest ? !isEmpty(approvalRequest?.formDocument?.id) : isOutput);

      if (isUnderDefault) {
        const nowDate = (new Date()).toISOString();
        datePickerState?.setValue(nowDate);
        save(nowDate);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approvalRequest]);

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
      save(moment.tz(value || "", "MM/DD/YYYY", TIME_ZONE).startOf("day").toISOString());
    };

    return Component({
      ...(props as T),
      datePickerState,
      onDatePickerClick,
      onDatePickerClose,
      onChange,
      editorProperties,
      disablePastDates,
      defaultValue,
      name,
    });
  };

  return (props: T) => Comp(props);
};

import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FB } from '..';
import { SM } from '../../../App';
import { MomentFormats, useDate } from '../../../common/utils/date';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { useFormContext } from '../../components/forms/FormContext';
import FBDatePickerState from './FBDatePicker.state';
import { FBDatePickerProps } from './FBDatePicker.types';

export const withDatePicker = <T extends FBDatePickerProps>(
  Component: React.FunctionComponent<T>,
): React.FunctionComponent<T> => {
  const Comp = ({
    datePickerState,
    onDatePickerClick,
    onDatePickerClose,
    onDatePickerClear,
    onChange,
    onDateChange,
    editorProperties,
    name = '',
    defaultValue,
    stateProvider,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { submitForm } = useFormContext();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const getStateValue = stateProvider?.getValue ?? ((): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = formState?.getFieldValue(name);
      return typeof value === 'string' ? value : undefined;
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const setStateValue = stateProvider?.setValue ?? ((val) => formState?.setFieldValue(name, val));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validateState = stateProvider?.validate ?? (() => formState?.validate());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    const initialValue = getStateValue();
    datePickerState = FB.useRef(FBDatePickerState, initialValue);
    const defaultCurrentDate = editorProperties?.includes('defaultCurrentDate') ?? false;
    const disablePastDates = editorProperties?.includes('disablePastDates') ?? false;
    const { id, isOutput } = workspaceState ?? {};
    const [approvalRequest, setApprovalRequest] = useState<ChangeRequest>();
    const { convertDateTimeToUserTz } = useDate();

    const save = debounce((date?: string) => {
      if (!date) { return; }
      setStateValue(date);
      validateState?.();

      // Only perform workspace operations if using default formState and field is under workspace
      if (!stateProvider) {
        const isUnderWorkspace = workspaceState?.getSchemaItem(name);
        if (!isUnderWorkspace) { return; }

        if (workspaceState?.isChangeRequest) {
          submitForm();
        }

        workspaceState?.saveDocRev(formState?.getValues());
      }
    }, 100);

    SM.reaction(
      () => workspaceState?.changeRequest,
      (value?: ChangeRequest) => {
        if (value) {
          setApprovalRequest(value);
        }
      },
    );

    useEffect(() => {
      // Populate with a default value if there is no default value, no initialValue, the editorProperties has
      //  defaultCurrentDate & the documentRevision is an output
      const isUnderDefault
        = !defaultValue
        && !initialValue
        && defaultCurrentDate
        && (approvalRequest ? !isEmpty(approvalRequest?.formDocument?.id) : isOutput);

      if (isUnderDefault) {
        const nowDate = convertDateTimeToUserTz(
          moment().format(MomentFormats.MonthDateYearTwoDigit),
          MomentFormats.MonthDateYearTwoDigit,
        );
        datePickerState?.setValue(nowDate);
        if (workspaceState?.isChangeRequest) { return; }
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
      const date = convertDateTimeToUserTz(value ?? '', MomentFormats.MonthDateYearTwoDigit);
      datePickerState?.setValue(date);
      save(date);
      // Call custom onDateChange callback if provided
      if (onDateChange) {
        onDateChange(date);
      }
    };

    onDatePickerClear = () => {
      datePickerState?.setValue(undefined);

      if (stateProvider) {
        setStateValue(undefined);
        validateState?.();
      } else {
        formState?.omitFieldValue(name);
        validateState?.();

        const isUnderWorkspace = workspaceState?.getSchemaItem(name);
        if (!isUnderWorkspace) {
          return;
        }

        if (workspaceState?.isChangeRequest) {
          submitForm();
        }

        workspaceState?.saveDocRev(formState?.getValues());
      }
    };

    return Component({
      ...(props as T),
      datePickerState,
      onDatePickerClick,
      onDatePickerClose,
      onDatePickerClear,
      onChange,
      onDateChange,
      editorProperties,
      disablePastDates,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      defaultValue,
      name,
      stateProvider,
    });
  };

  return (props: T) => Comp(props);
};

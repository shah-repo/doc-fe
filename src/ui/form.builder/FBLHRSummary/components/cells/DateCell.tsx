import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import {
  MomentFormats,
  TIME_ZONE,
} from '../../../../../common/utils/date';
import {
  DatePicker,
  FormikField,
} from '../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { DATE_TYPE, LHR_SUMARY_FIELDS } from '../../constants';
import { CustomTemplateProps } from '../../types';

export const DateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
  onClick,
  PopoverProps,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field];
  const isCalPmDueDate = [DATE_TYPE.customCalDueDate, DATE_TYPE.customPmDueDate].includes(field as DATE_TYPE);

  if (!isEditMode) {
    let displayValue = value;
    if (isCalPmDueDate && DATE_TYPE.customCalDueDate === field && dataItem.pmDueDateText) {
      displayValue = dataItem.calDueDateText;
    } else if (isCalPmDueDate && DATE_TYPE.customPmDueDate === field && dataItem.calDueDateText) {
      displayValue = dataItem.pmDueDateText;
    }

    return (
      <OverflowTooltip
        title={displayValue}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>);
  }

  const { getFieldProps, setFieldValue } = useFormikContext();
  const removeCustomPrefix = (fieldName: string): string =>
    fieldName.replace(/^custom/, '').replace(/^[A-Z]/, (char) => char.toLowerCase());

  const handleChange = (date: MaterialUiPickersDate) => {
    const dateInPST = date && moment.tz(moment(date).format(MomentFormats.YearMonthDate), TIME_ZONE).startOf('day');
    const dateValue = dateInPST?.utc().format();
    setFieldValue(field, dateValue);
    setFieldValue(removeCustomPrefix(field), dateValue);
    if (isCalPmDueDate && DATE_TYPE.customCalDueDate === field && dataItem.pmDueDateText) {
      setFieldValue(LHR_SUMARY_FIELDS.calDueDateText, dateValue ? moment(dateValue).format(MomentFormats.MonthDateYearTwoDigit) : dateValue);
    } else if (isCalPmDueDate && DATE_TYPE.customPmDueDate === field && dataItem.calDueDateText) {
      setFieldValue(LHR_SUMARY_FIELDS.pmDueDateText, dateValue ? moment(dateValue).format(MomentFormats.MonthDateYearTwoDigit) : dateValue);
    }
  };

  const handleClear = () => {
    setFieldValue(field, null);
    setFieldValue(removeCustomPrefix(field), null);
    if (isCalPmDueDate && DATE_TYPE.customCalDueDate === field && dataItem.pmDueDateText) {
      setFieldValue(LHR_SUMARY_FIELDS.calDueDateText, null);
    } else if (isCalPmDueDate && DATE_TYPE.customPmDueDate === field && dataItem.calDueDateText) {
      setFieldValue(LHR_SUMARY_FIELDS.pmDueDateText, null);
    }
  };

  return (
    <FormikField name={field}>
      <DatePicker
        {...getFieldProps(field)}
        PopoverProps={PopoverProps}
        size="small"
        data-cy={`${field}`}
        onChange={handleChange}
        onClear={field === LHR_SUMARY_FIELDS.customRecordCreationDate ? undefined : handleClear}
        format={MomentFormats.MonthDateYearTwoDigit}
      />
    </FormikField>
  );
};

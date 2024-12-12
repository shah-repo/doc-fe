import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import {
  MomentFormats,
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
import { CustomTemplateProps } from '../../types';

export const DateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
  onClick,
  PopoverProps,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field];

  if (!isEditMode) {
    return (
      <OverflowTooltip
        title={value}
        placement="top"
        onClick={() => onClick?.({ dataItem })}
        interactive
        arrow
      >
        {value}
      </OverflowTooltip>);
  }

  const { getFieldProps, setFieldValue } = useFormikContext();
  const removeCustomPrefix = (fieldName: string): string =>
    fieldName.replace(/^custom/, '').replace(/^[A-Z]/, (char) => char.toLowerCase());

  const handleChange = (date: MaterialUiPickersDate) => {
    const dateValue = date?.toISOString();
    setFieldValue(field, dateValue);
    setFieldValue(removeCustomPrefix(field), dateValue);
  };

  const handleClear = () => {
    setFieldValue(field, null);
    setFieldValue(removeCustomPrefix(field), null);
  };

  return (
    <FormikField name={field}>
      <DatePicker
        {...getFieldProps(field)}
        PopoverProps={PopoverProps}
        size="small"
        data-cy={`${field}`}
        onChange={handleChange}
        onClear={handleClear}
        format={MomentFormats.MonthDateYearTwoDigit}
      />
    </FormikField>
  );
};

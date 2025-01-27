import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { MomentFormats, TIME_ZONE, getFormattedDateString } from '../../../../common/utils/date';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';

export const DateCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue, errors } = useFormikContext() ?? {};
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field] as string;

  const handleChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }

    setFieldValue(field, date.startOf('day').toISOString());
  };

  const handleClear = () => {
    setFieldValue(field, '');
  };

  if (isEditMode) {
    const { value: fieldValue, ...fieldProps } = getFieldProps?.(field) ?? {};

    return (
      <FormikField name={field} error={get(errors, field)}>
        <DatePicker
          {...fieldProps}
          value={moment(fieldValue).tz(TIME_ZONE)}
          size="small"
          onChange={handleChange}
          onClear={handleClear}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return (
    <>
      {getFormattedDateString(value, MomentFormats.MonthDateYearTwoDigit)}
    </>
  );
};

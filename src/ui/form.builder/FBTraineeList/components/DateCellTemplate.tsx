import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { getFormattedDateStringWithoutTimeZone, MomentFormats } from '../../../../common/utils/date';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps } from '../types';

export const DateCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue, errors } = useFormikContext() ?? {};
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field] as string;

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue(field, date?.toISOString());
  };

  if (isEditMode) {
    return (
      <FormikField name={field} error={get(errors, field)}>
        <DatePicker
          {...getFieldProps?.(field)}
          size="small"
          onChange={handleChange}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return (
    <>
      {getFormattedDateStringWithoutTimeZone(value, MomentFormats.MonthDateYearTwoDigit)}
    </>
  );
};

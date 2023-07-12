import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';

export const DateCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field] as React.ReactElement;

  console.log(value);

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue('date', date?.toISOString());
  };

  if (isEditMode) {
    return (
      <FormikField
        name="date"
        required
      >
        <DatePicker
          {...getFieldProps('date')}
          size="small"
          onChange={handleChange}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return value;
};

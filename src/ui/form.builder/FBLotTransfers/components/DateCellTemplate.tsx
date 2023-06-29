import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import { MomentFormats, getFormattedDateString } from '../../../../common/utils/date';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';

export const DateCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem.date;

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue(field, date?.toDate());
  };

  if (isEditMode) {
    return (
      <FormikField
        name={field}
        required
      >
        <DatePicker
          {...getFieldProps(field)}
          size="small"
          onChange={handleChange}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return <>{getFormattedDateString(value, MomentFormats.MonthDateYearTwoDigit)}</>;
};

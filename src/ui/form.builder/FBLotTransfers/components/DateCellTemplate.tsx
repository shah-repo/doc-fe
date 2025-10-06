import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import moment from 'moment';
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

  const handleChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      setFieldValue('date', null);
      return;
    }

    const updatedDate = moment(date).format(MomentFormats.YearMonthDateDash);
    setFieldValue('date', updatedDate);
  };

  const handleClear = () => {
    setFieldValue('date', null);
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
          onClear={handleClear}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return value;
};

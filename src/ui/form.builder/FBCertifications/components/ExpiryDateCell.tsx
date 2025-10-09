import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import {
  MomentFormats,
  useDate,
} from '../../../../common/utils/date';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps } from '../types';

export const ExpiryDateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
}) => {
  const fieldValue = dataItem[field];
  const { getFormattedDateString } = useDate();
  const value
    = fieldValue
    && getFormattedDateString(fieldValue, MomentFormats.MonthDateYearTwoDigit);

  if (![Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    return <>{value}</>;
  }

  const { getFieldProps, setFieldValue } = useFormikContext();
  const handleChange = (date: MaterialUiPickersDate) => {
    const updatedDate = date && moment(date).format(MomentFormats.YearMonthDateDash);
    setFieldValue(field, updatedDate);
  };

  return (
    <FormikField name={field}>
      <DatePicker
        {...getFieldProps(field)}
        size="small"
        data-cy={`${field}`}
        onChange={handleChange}
        format={MomentFormats.MonthDateYearTwoDigit}
      />
    </FormikField>
  );
};

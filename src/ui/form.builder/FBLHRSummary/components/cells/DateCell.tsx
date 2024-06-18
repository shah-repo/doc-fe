import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import {
  getFormattedDateString,
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
import { CustomTemplateProps } from '../../types';

export const DateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const fieldValue = dataItem[field];
  const value = fieldValue && getFormattedDateString(
    fieldValue,
    MomentFormats.MonthDateYearTwoDigit,
  );

  if (isEditMode) {
    const { getFieldProps, setFieldValue } = useFormikContext();

    const handleChange = (date: MaterialUiPickersDate) => {
      setFieldValue(field, date?.toISOString());
    };

    return (
      <FormikField name={field}>
        <DatePicker
          {...getFieldProps(field)}
          size="small"
          onChange={handleChange}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    );
  }

  return <span>{value}</span>;
};

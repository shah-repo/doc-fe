import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import { MomentFormats } from '../../../../../common/utils/date';
import { DatePicker, FormikField } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../types';

export const DueDateCell: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field] as React.ReactElement;

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue(field, date?.toISOString());
  };

  if (isEditMode) {
    return (
      <FormikField
        name={field}
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

  return value ?? EMPTY_PLACEHOLDER;
};

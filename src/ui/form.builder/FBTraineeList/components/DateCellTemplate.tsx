import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
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

    setFieldValue(field, date.utc().startOf('day').toISOString());
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
      {moment.utc(value).format(MomentFormats.MonthDateYearTwoDigit)}
    </>
  );
};

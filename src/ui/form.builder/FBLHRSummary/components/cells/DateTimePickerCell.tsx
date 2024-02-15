import { TextField } from '@material-ui/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../../common/utils/date';
import { FormikField } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { CustomTemplateProps } from '../../types';

export const DateTimePickerCell: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field];
  const defaultDate = moment().format(MomentFormats.LHRSummaryDefaultDateTimeFormatter);
  const getUtcFormattedString = (date: string) =>
    moment(date, MomentFormats.AsyncTasksDefaultDateTimeFormatter).toISOString();
  const [selectedDate, setSelectedDate] = React.useState(
    getUtcFormattedString(value || defaultDate),
  );

  const handleChange = (event) => {
    console.log('date :', event);
    setSelectedDate(getUtcFormattedString(event?.target?.value));
    setFieldValue(field, selectedDate);
  };

  if (isEditMode) {
    return (
      <FormikField
        name={field}
      >
        <TextField
          {...getFieldProps(field)}
          id="datetime-local"
          type="datetime-local"
          value={selectedDate}
          defaultValue={value}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormikField>
    );
  }

  return value;
};

import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React from 'react';
import { MomentFormats, getFormattedDateString } from '../../../../common/utils/date';
import { DatePicker, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { CustomTemplateProps } from '../types';

export const DateCellTemplate: React.FC<CustomTemplateProps> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem.date;

  const handleChange = (date: MaterialUiPickersDate) => {
    const event = new Event('change') as unknown;
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event as React.SyntheticEvent<HTMLInputElement>,
      field,
      value: date?.toDate(),
    });
  };

  if (isEditMode) {
    return (
      <FormField>
        <DatePicker
          onChange={handleChange}
          format={MomentFormats.MonthDateYearTwoDigit}
          value={value}
        />
      </FormField>
    );
  }

  return <>{getFormattedDateString(value, MomentFormats.MonthDateYearTwoDigit)}</>;
};

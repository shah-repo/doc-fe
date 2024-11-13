import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import {
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
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { CustomTemplateProps } from '../../types';

export const DateCell: React.FC<CustomTemplateProps> = ({
  field,
  dataItem,
  PopoverProps,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const value = dataItem[field];

  if (!isEditMode) {
    return (
      <OverflowTooltip
        title={value}
        placement="top"
        interactive
        arrow
      >
        {value}
      </OverflowTooltip>);
  }

  const { getFieldProps, setFieldValue } = useFormikContext();
  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue(field, date?.toISOString());
  };

  return (
    <FormikField name={field}>
      <DatePicker
        {...getFieldProps(field)}
        PopoverProps={PopoverProps}
        size="small"
        data-cy={`${field}`}
        onChange={handleChange}
        format={MomentFormats.MonthDateYearTwoDigit}
      />
    </FormikField>
  );
};

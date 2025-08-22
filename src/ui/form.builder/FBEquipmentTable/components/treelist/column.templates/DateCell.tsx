import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';
import {
  MomentFormats,
  TIME_ZONE,
} from '../../../../../../common/utils/date';
import {
  DatePicker,
  FormikField,
} from '../../../../../components/forms/fields-next';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { isEditEquipItem } from '../utils';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

export const DateCell: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, onClick } = props;
  const isEditMode = isEditEquipItem(dataItem);
  const value = dataItem[field];

  if (!isEditMode) {
    const displayValue = value;

    return (
      <TreeListCellWrapper {...props}>
        <OverflowTooltip
          title={displayValue}
          placement="top"
          onClick={() => onClick?.({ dataItem })}
          interactive
          arrow
        >
          {displayValue}
        </OverflowTooltip>
      </TreeListCellWrapper>);
  }

  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange = (date: MaterialUiPickersDate) => {
    const dateInPST = date && moment.tz(moment(date).format(MomentFormats.YearMonthDate), TIME_ZONE).startOf('day');
    const dateValue = dateInPST?.utc().format();
    setFieldValue(field, dateValue);
  };

  const handleClear = () => {
    setFieldValue(field, null);
  };

  return (
    <TreeListCellWrapper {...props}>
      <FormikField name={field}>
        <DatePicker
          {...getFieldProps(field)}
          size="small"
          data-cy={`${field}`}
          onChange={handleChange}
          onClear={handleClear}
          format={MomentFormats.MonthDateYearTwoDigit}
        />
      </FormikField>
    </TreeListCellWrapper>
  );
};

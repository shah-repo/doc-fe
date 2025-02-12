import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import useStyles from '../styles';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue('date', date?.toISOString());
  };

  const handleClear = () => {
    setFieldValue('date', null);
  };

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
};

export const DateCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = dataItem[field] as string;

  return (
    <OverflowContent
      title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
      onClick={handleClick}
    >
      {displayValue}
    </OverflowContent>
  );
};

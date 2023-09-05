import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useFormikContext } from 'formik';
import React from 'react';
import { MomentFormats } from '../../../../common/utils/date';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { DatePicker, FormikField } from '../../../components/forms/fields-next';
import { CustomTemplateProps } from '../types';
import OverflowingContent from './OveflowContent';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange = (date: MaterialUiPickersDate) => {
    setFieldValue('date', date?.toISOString());
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
        format={MomentFormats.MonthDateYearTwoDigit}
      />
    </FormikField>
  );
};

export const DateCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = dataItem[field] as string;

  return (
    <OverflowingContent onClick={handleClick}>
      {displayValue}
    </OverflowingContent>
  );
};

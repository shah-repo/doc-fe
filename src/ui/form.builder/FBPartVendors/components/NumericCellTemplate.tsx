import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { positiveNumber, validator } from '../../../components/forms/fields/validators';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import OverflowContent from '../../../components/OverflowContent';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
      validate={validator(positiveNumber)}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="number"
        inputProps={{ min: 0 }}
        size="small"
      />
    </FormikField>
  );
};

export const NumericCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent onClick={handleClick}>
      {displayValue}
    </OverflowContent>
  );
};

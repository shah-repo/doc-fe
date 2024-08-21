import { InputAdornment } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { positiveNumber, validator } from '../../../components/forms/fields/validators';
import { CustomTemplateProps } from '../types';

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
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormikField>
  );
};

export const UnitCostCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const value = get(dataItem, field) as string;
  const displayValue = value ? `$${value}` : EMPTY_VALUE_PLACEHOLDER;

  return (
    <OverflowContent onClick={handleClick}>
      {displayValue}
    </OverflowContent>
  );
};

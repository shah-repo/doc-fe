import { useFormikContext } from 'formik';
import React from 'react';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { requiredNumber, validator } from '../../../components/forms/fields/validators';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { DEDUCTABLE_TRANSFER_TYPES } from '../constants';
import { CustomTemplateProps } from '../types';

export const QuantityCellTemplate: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = dataItem.quantity;

  if (isEditMode) {
    return (
      <FormikField
        name={field}
        validate={validator(requiredNumber)}
      >
        <TextField
          {...getFieldProps(field)}
          type="number"
          inputProps={{ min: 0 }}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{DEDUCTABLE_TRANSFER_TYPES.includes(dataItem.type) ? `-${defaultValue}` : defaultValue}</>;
};

import React, { ChangeEventHandler } from 'react';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { DEDUCTABLE_TRANSFER_TYPES } from '../constants';
import { CustomTemplateProps } from '../types';

export const QuantityCellTemplate: React.FC<CustomTemplateProps> = ({ dataIndex, dataItem, field, onChange }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = dataItem.quantity;

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    const value = event.target.value;

    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value,
    });
  };

  if (isEditMode) {
    return (
      <FormField>
        <TextField
          value={defaultValue}
          type="number"
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </FormField>
    );
  }

  return <>{DEDUCTABLE_TRANSFER_TYPES.includes(dataItem.type) ? `-${defaultValue}` : defaultValue}</>;
};

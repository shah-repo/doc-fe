import React, { ChangeEvent } from 'react';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { LotTransfer, LotTransferType } from '../types';

export const QuantityCellTemplate: React.FC<CellTemplateProps<LotTransfer>> = ({ dataIndex, dataItem, field, onChange }) => {
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

  const handleChange = (event: ChangeEvent<unknown>, value: LotTransferType) => {
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value,
    });
  };

  const NEGATIVE_TRANSFER_TYPES = [LotTransferType.Allocate, LotTransferType.Transfer];

  return isEditMode ? (
    <FormField >
      <TextField
        value={dataItem.quantity}
        onChange={handleChange}
      />
    </FormField>

  ) : (
    <>{NEGATIVE_TRANSFER_TYPES.includes(dataItem.type) ? `-${dataItem.quantity}` : dataItem.quantity}</>
  );
};

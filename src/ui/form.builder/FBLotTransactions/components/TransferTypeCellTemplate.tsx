import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { LotTransfer, LotTransferType } from '../types';

export const TransferTypeCellTemplate: React.FC<CellTemplateProps<LotTransfer>> = ({ dataIndex, dataItem, field, onChange }) => {
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

  const transferTypeOptions = Object.values(LotTransferType).map((value) => {
    const label = translate(`form.builder.lotTransactions.type.${value}`);
    return { value, label };
  });

  return isEditMode ? (
    <FormField>
      <Autocomplete
        blurOnSelect
        value={dataItem.type}
        options={transferTypeOptions}
        getOptionLabel={({ label }) => label}
        onChange={handleChange}
      />
    </FormField>
  ) : (
    <>{translate(`form.builder.lotTransactions.type.${dataItem.type}`)}</>
  );
};

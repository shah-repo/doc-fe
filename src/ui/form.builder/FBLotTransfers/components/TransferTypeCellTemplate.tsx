import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { ArrayElement, CustomTemplateProps, LotTransferType } from '../types';

export const TransferTypeCellTemplate: React.FC<CustomTemplateProps> = ({ dataIndex, dataItem, field, onChange }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: ArrayElement<typeof options>) => {
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value: value?.value,
    });
  };

  const options = Object.values(LotTransferType).map((value) => ({
    value,
    label: translate(`form.builder.lot.transfers.type.${value}`),
  }));

  const value = options.find((option) => option.value === dataItem.type);

  if (isEditMode) {
    return (
      <FormField>
        <Autocomplete
          blurOnSelect
          value={value}
          options={options}
          getOptionLabel={(option: ArrayElement<typeof options>) => option.label}
          onChange={handleChange}
        />
      </FormField>
    );
  }
  return <>{translate(`form.builder.lot.transfers.type.${dataItem.type}`)}</>;
};

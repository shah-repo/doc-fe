import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { TextField } from '../../../../../../../components/forms/fields-next';
import { toastError } from '../../../../../../notifications';
import { CustomTemplateProps } from '../types';

export const QuantityAssignedCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem, onUpdateScanLot }) => {
  const max = dataItem?.onHand;

  const onChange = ({ target: { value: rawValue } }: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(rawValue ?? 0);

    if (value < 0) {
      toastError(translate('scan.lot.grid.quantity.min.error.message'));
      return;
    }

    if (max !== undefined && value > max) {
      toastError(translate('scan.lot.grid.quantity.max.error.message', { max }));
      return;
    }

    onUpdateScanLot?.({
      ...dataItem,
      [field]: value,
    });
  };

  return (
    <TextField
      value={dataItem[field]}
      type="number"
      placeholder={translate('common.enter')}
      onChange={onChange}
      inputProps={{ min: 0, max }}
      size="small"
    />
  );
};

import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { TextField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';

export const SerialNumberCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem, onUpdateScanLot }) => {
  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateScanLot?.({
      ...dataItem,
      [field]: value,
    });
  };

  return (
    <TextField
      value={dataItem[field]}
      placeholder={translate('common.enter')}
      type="text"
      onChange={onChange}
      size="small"
    />
  );
};

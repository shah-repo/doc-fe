import { get } from 'lodash';
import React, { ChangeEventHandler } from 'react';
import { translate } from '../../../../common/intl';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../../FBApprovalMatrixRoles/constants';
import { LotTransfer } from '../types';

export const CommentsCellTemplate: React.FC<CellTemplateProps<LotTransfer>> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

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

  const defaultValue = get(dataItem, field, '') as string;

  return isEditMode ? (

    <FormField >
      <TextField
        value={defaultValue}
        placeholder={translate('form.builder.add.lotTransactions.comment')}
        onChange={handleChange}
      />
    </FormField>
  ) : (
    <>{dataItem.comments}</>
  );
};

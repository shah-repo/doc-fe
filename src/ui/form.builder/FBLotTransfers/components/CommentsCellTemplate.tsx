import { get } from 'lodash';
import React, { ChangeEventHandler } from 'react';
import { translate } from '../../../../common/intl';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const CommentsCellTemplate: React.FC<CustomTemplateProps> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

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

  if (isEditMode) {
    return (
      <FormField>
        <TextField
          value={defaultValue}
          placeholder={translate('form.builder.lot.transfers.comments')}
          onChange={handleChange}
        />
      </FormField>
    );
  }

  return <>{dataItem.comments ?? EMPTY_VALUE_PLACEHOLDER}</>;
};

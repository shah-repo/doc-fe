import { get } from 'lodash';
import React, { ChangeEventHandler } from 'react';
import { translate } from '../../../../common/intl';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { ERROR_FIELD, MODE_FIELD, Mode } from '../constants';
import { EditableRole } from '../types';

const TextCellTemplate: React.FC<CellTemplateProps<EditableRole>> = ({
  field,
  dataIndex,
  dataItem,
  column,
  onChange,
}) => {
  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit && column.editable)
  );
  const isError = dataItem[ERROR_FIELD] === column.id;

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
      <FormField error={isError}>
        <TextField
          value={defaultValue}
          placeholder={translate('form.builder.approval.role')}
          onChange={handleChange}
        />
      </FormField>
    );
  }
  return (
    <OverflowTooltip
      title={defaultValue}
      arrow
      placement="top"
    >
      {defaultValue}
    </OverflowTooltip>
  );
};

export default TextCellTemplate;

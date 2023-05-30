import { get } from 'lodash';
import React, { ChangeEventHandler } from 'react';
import { translate } from '../../../../common/intl';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { FormField, TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
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
          placeholder={translate('form.builder.approval.role')}
          onChange={handleChange}
        />
      </FormField>
    );
  }
  return <>{defaultValue}</>;
};

export default TextCellTemplate;

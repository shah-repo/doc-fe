import { get } from 'lodash';
import React, { ChangeEventHandler } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const UnitCostCellTemplate: React.FC<Props> = ({
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

  const defaultValue = get(dataItem, field) as string;

  if (isEditMode) {
    return (
      <TextField
        type="text"
        name="unitCost"
        size="small"
        onChange={handleChange}
        value={defaultValue}
      />
    );
  }

  return <>{dataItem.cost}</>;
};

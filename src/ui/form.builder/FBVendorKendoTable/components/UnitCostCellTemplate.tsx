import { get } from 'lodash';
import React, { ChangeEventHandler, useState } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const UnitCostCellTemplate: React.FC<Props> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const [value, setValue] = useState(get(dataItem, field) as string);

  const isEditMode = (
    dataItem[MODE_FIELD] === Mode.add || (dataItem[MODE_FIELD] === Mode.edit)
  );

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value: newValue,
    });
  };

  if (isEditMode) {
    return (
      <FormikField
        name={field}
      >
        <TextField
          type="text"
          name="unitCost"
          size="small"
          onChange={handleChange}
          value={value}
        />
      </FormikField>
    );
  }

  return <>{dataItem.cost}</>;
};

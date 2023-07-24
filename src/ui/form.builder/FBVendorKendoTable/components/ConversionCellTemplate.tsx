import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React, { ChangeEventHandler, useState } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableVendorData } from '../types';

interface Props extends CellTemplateProps<EditableVendorData> {}

export const ConversionCellTemplate: React.FC<Props> = ({
  field,
  dataIndex,
  dataItem,
  onChange,
}) => {
  const isEditMode
    = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;

  const [value, setValue] = useState(get(dataItem, field) as number);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    event,
  ) => {
    const newValue = event.target.value as unknown as number;
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
          {...getFieldProps(field)}
          name="conversion"
          type="number"
          size="small"
          inputProps={{ min: 0 }}
          onChange={handleChange}
          value={value}
        />
      </FormikField>
    );
  }

  return <>{dataItem.conversion}</>;
};
